import { Transform, TransformFnParams } from 'class-transformer';

export const EscapeHtml = () =>
  Transform((data: TransformFnParams) => {
    const regExp = /<(.|\n)*?>/gm;
    const allowedTags = [
      /^<\/?(\s|\n)*(strong|code|i)(\s|\n)*?>$/,
      /<\/?(\s|\n)*a(href="(.|\n)*?"|title="(.|\n)*?"|\s|\n)*?>/,
    ];

    const result = data.value.replace(regExp, (match) => {
      const allowed = allowedTags.find((e) => e.test(match));
      return allowed ? match : match.replace('<', '&lt;').replace('>', '&gt;');
    });
    return result;
  });
