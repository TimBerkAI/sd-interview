from typing import Any

from markupsafe import Markup
from wtforms import TextAreaField
from wtforms.widgets import html_params

_CKEDITOR_JS = Markup('<script src="/static/js/ckeditor.js"></script>')


class CKEditorWidget:
    def __call__(self, field: 'CKEditorField', **kwargs: Any) -> Markup:
        field_id = kwargs.get('id', field.id)

        kwargs['id'] = field_id
        kwargs['name'] = field.name

        textarea = Markup(
            '<textarea {attrs}>{value}</textarea>'.format(
                attrs=html_params(**kwargs),
                value=field._value() or '',
            )
        )

        script = Markup(f"""
<script>
(function () {{
  function init() {{
    var textarea = document.getElementById("{field_id}");
    if (!textarea) return;

    ClassicEditor.create(textarea, {{
      licenseKey: "GPL",
    }}).catch(console.error);
  }}

  if (document.readyState === "loading") {{
    document.addEventListener("DOMContentLoaded", init);
  }} else {{
    init();
  }}
}})();
</script>
""")
        return _CKEDITOR_JS + textarea + script


class CKEditorField(TextAreaField):
    def __init__(self, label: str = '', validators=None, **kwargs: Any) -> None:
        super().__init__(label, validators, **kwargs)
        self.widget = CKEditorWidget()

    def _value(self) -> str:
        if self.data is None:
            return ''
        return self.data

    def process_formdata(self, valuelist: list) -> None:
        """CKEditor возвращает HTML-строку — сохраняем как есть."""
        if not valuelist or not valuelist[0]:
            self.data = None
            return
        self.data = valuelist[0]
