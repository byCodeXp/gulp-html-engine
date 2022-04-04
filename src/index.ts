import path from 'path';
import fs from 'fs';
import through2, { TransformCallback } from 'through2';

function test(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
   const dir = path.parse(chunk.path).dir;

   const content = chunk.contents.toString() as string;
   const result = analyze(content, dir);

   chunk.contents = Buffer.from(result);
   callback(null, chunk);
}

module.exports = function () {
   return through2.obj(test);
};

function analyze(content: string, dir: string): string {
   const tokens = parse(content);

   for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];
      const file = path.resolve(dir, token.value);
      
      let text = fs.readFileSync(file, 'utf8');
      text = analyze(text, dir);
      content = content.slice(0, token.start) + text + content.slice(token.end);
   }

   return content;
}

function parse(text: string) {
   const pattern = /{{ *([a-z.\\\/]*) *}}/g;
   const matches: Array<{ value: string; start: number; end: number }> = [];

   let match = null;
   while (true) {
      match = pattern.exec(text);
      if (match === null) {
         break;
      }
      console.log(`match ${JSON.stringify(match)} found at ${match?.index}`);
      matches.push({ value: match[1], start: match.index, end: match.index + match[0].length });
   }
   return matches;
}
