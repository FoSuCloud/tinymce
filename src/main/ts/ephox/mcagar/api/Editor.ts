import { Id } from '@ephox/katamari';
import { Merger } from '@ephox/katamari';
import { Insert } from '@ephox/sugar';
import { Remove } from '@ephox/sugar';
import { Element } from '@ephox/sugar';
import { Attr } from '@ephox/sugar';
import { Selectors } from '@ephox/sugar';
import { Chain } from '@ephox/agar';
import 'tinymce';
import { document, setTimeout } from '@ephox/dom-globals';
import { updateTinymceUrls } from '../loader/Urls';
import { getTinymce } from '../loader/Globals';

updateTinymceUrls('tinymce');

var cFromElement = function (element, settings) {
  return Chain.async(function (_, next, die) {
    var randomId = Id.generate('tiny-loader');

    Attr.set(element, 'id', randomId);
    Insert.append(Element.fromDom(document.body), element);

    getTinymce().each((tinymce) => {
      tinymce.init(Merger.merge(settings, {
        selector: '#' + randomId,
        setup: function (editor) {
          editor.on('SkinLoaded', function () {
            setTimeout(function () {
              next(editor);
            }, 0);
          });
        }
      }));
    });
  });
};

var cFromHtml = function (html: string, settings) {
  var element = html ? Element.fromHtml(html) : Element.fromTag(settings.inline ? 'div' : 'textarea')
  return cFromElement(element, settings);
};

var cFromSettings = function (settings) {
  return cFromHtml(null, settings);
};

var cRemove = Chain.op(function (editor: any) {
  var id = editor.id;
  editor.remove();
  Selectors.one('#' + id).each(Remove.remove);
});

export default {
  cFromHtml: cFromHtml,
  cFromElement: cFromElement,
  cFromSettings: cFromSettings,
  cCreate: cFromSettings({}),
  cCreateInline: cFromSettings({ inline: true }),
  cRemove: cRemove
};