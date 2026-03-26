import json
from typing import Any

from markupsafe import Markup
from wtforms import TextAreaField
from wtforms.widgets import html_params

_JSONEDITOR_LOCAL_CSS = Markup('<link href="/static/css/jsoneditor.min.css" rel="stylesheet" />')
_JSONEDITOR_CSS = Markup(
    '<link href="https://cdn.jsdelivr.net/npm/jsoneditor@10/dist/jsoneditor.min.css" rel="stylesheet" />'
)
_JSONEDITOR_JS = Markup('<script src="/static/js/jsoneditor.min.js"></script>')


class JSONEditorWidget:
    def __call__(self, field: 'JSONEditorField', **kwargs: Any) -> Markup:
        field_id = kwargs.get('id', field.id)
        container_id = f'{field_id}_container'

        kwargs['id'] = field_id
        kwargs['name'] = field.name
        kwargs['style'] = 'display: none;'

        textarea = Markup(
            '<textarea {attrs}>{value}</textarea>'.format(
                attrs=html_params(**kwargs),
                value=field._value() or '',
            )
        )

        container = Markup(f'<div id="{container_id}" style="height:300px;"></div>')

        script = Markup(f"""
<script>
(function () {{
  function init() {{
    var textarea = document.getElementById("{field_id}");
    var container = document.getElementById("{container_id}");
    if (!textarea || !container) return;

    var editor = new JSONEditor(container, {{ mode: "code" }});

    try {{
      editor.set(JSON.parse(textarea.value || "null"));
    }} catch (_) {{
      editor.setText(textarea.value || "");
    }}

    var form = textarea.closest("form");
    if (form) {{
      form.addEventListener("submit", function () {{
        try {{
          textarea.value = editor.getText();
        }} catch (_) {{}}
      }});
    }}
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", init);
  }} else {{
    init();
  }}
}})();
</script>
""")
        return _JSONEDITOR_CSS + _JSONEDITOR_JS + container + textarea + script


class JSONEditorField(TextAreaField):
    def __init__(self, label: str = '', validators=None, **kwargs: Any) -> None:
        super().__init__(label, validators, **kwargs)
        self.widget = JSONEditorWidget()

    def _value(self) -> str:
        """Сериализуем Python-объект → строку для textarea."""
        if self.data is None:
            return ''
        if isinstance(self.data, str):
            return self.data
        return json.dumps(self.data, ensure_ascii=False)

    def process_formdata(self, valuelist: list) -> None:
        """Десериализуем строку из формы → Python-объект для SQLAlchemy."""
        if not valuelist or not valuelist[0]:
            self.data = None
            return
        try:
            self.data = json.loads(valuelist[0])
        except (ValueError, TypeError):
            self.data = valuelist[0]
