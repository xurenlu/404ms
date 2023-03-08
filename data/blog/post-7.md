---
  title: 在 nextjs 中集成 quill 所见即所得编辑器
  date: 2023-03-08 05:55:43
  summary: 查看全文>>
  tags: []
---

这几天在学习 nextJs 的过程中，发现 nextjs 应用和 react 应用还是有很大差异，毕竟是 服务端渲染的。在打算引入一个所见即所得的编辑器时，遇到了一点问题。昨天熬到凌晨两点，终于搞定，实现方式略有点 dirty，后续再整改吧。
现代所见即所得的编辑器，其实那些加粗加横线啥的都不重要，最主要是对插入图片和视频之类的支持，而视频一般直接用链接跳转到第三方视频网站就完了，图片的话，需要实现一个上传控件。上传控件我就不叙述了，参见 https://juejin.cn/post/7082679181288407070 这个资料吧。（代码中的 Uploader 就是用的这个实现）
wysiwyg 控件，我选择的是 quill,https://quilljs.com/，请参考[这篇](https://www.simplenextjs.com/posts/next-rich-editor-quill) 查看如何将 quill 集成进 nextjs.

进行到这步后，quill 能正常工作，但是 toolbar 上的行为不可控，所以我们还不能修改 图片按钮点击的事件。现在我们需要参照 [这里](https://github.com/zenoamaro/react-quill#custom-toolbar) 的 custom toolbar 部分，自定义 toolbar 的行。

最终的办法是，点击图片上传 icon 时，调用的是自定义的 insertImage 方法，这个方法把 quill 对象设置 为 window 的一个属性，把当前光标位置也设置在 window 的一个属性。上传完成后，回调方法通过 window 对象获取到 quill 对象，并用 quill 类的 clipboard 接口来将自定义的 html 写入。

最后完整的代码如下:

import dynamic from 'next/dynamic'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
ssr: false,
loading: () => <p>Loading ...</p>,
})

const CustomToolbar = () => (

    <div id="toolbar">
        <span className="ql-formats">
                        <select className="ql-header" defaultValue="3">
                          <option value="1">Heading</option>
                          <option value="2">Subheading</option>
                          <option value="3">Normal</option>
                        </select>
                        <select className="ql-font" defaultValue="sailec">
                          <option value="sailec">Sailec Light</option>
                          <option value="sofia">Sofia Pro</option>
                          <option value="slabo">Slabo 27px</option>
                          <option value="roboto">Roboto Slab</option>
                          <option value="inconsolata">Inconsolata</option>
                          <option value="ubuntu">Ubuntu Mono</option>
                        </select>
                      </span>
        <span className="ql-formats">
                        <button className="ql-bold"></button>
                        <button className="ql-italic"></button>
                        <button className="ql-underline"></button>
                      </span>
        <span className="ql-formats">
                        <button className="ql-list" value="ordered"></button>
                        <button className="ql-list" value="bullet"></button>
                        <select className="ql-align" defaultValue="false">
                          <option label="left"></option>
                          <option label="center" value="center"></option>
                          <option label="right" value="right"></option>
                          <option label="justify" value="justify"></option>
                        </select>
                      </span>
        <span className="ql-formats">
                        <button className="ql-link"></button>

                        <button className="ql-video"></button>
                      </span>
        <span className="ql-formats">
                        <button className="ql-formula"></button>
                        <button className="ql-code-block"></button>
                      </span>
        <span className="ql-formats">
                        <button className="ql-clean"></button>
                      </span>



        <button className={"ql-image"}></button>
    </div>

);

function insertImage() {
const cursorPosition = this.quill.getSelection().index;
window.cursorPosition = this.quill.getSelection().index;

    this.quill.insertText(cursorPosition, '');
    this.quill.setSelection(cursorPosition + 1);
    window.quill = this.quill;
    setTimeout(()=>{
        document.getElementsByClassName("rt-file-input")[0].click()
    },200)

}
const modules = {
toolbar: {
container: '#toolbar',
handlers: {
image:insertImage
},
},
};

const formats = [
'header',
'font',
'size',
'bold',
'italic',
'underline',
'strike',
'blockquote',
'list',
'bullet',
'indent',
'link',
'image',
'video',
]
export default function QuillEditor() {
const onUpload =(file)=>{
window.quill.clipboard.dangerouslyPasteHTML(window.cursorPosition,"<img src='"+file.data+"'/>")

    }
    return <>
        <CustomToolbar />
        <QuillNoSSRWrapper modules={modules} formats={formats} theme="snow"/>
        <Upload action={"/api/item/upload"} onSuccess={onUpload} id={"uploader"} className={"xup-uploader"}>
            <button className="ql-image"></button>
        </Upload>
        </>

}

---

欢迎前往原文讨论：[https://github.com/xurenlu/404ms/issues/7](https://github.com/xurenlu/404ms/issues/7)
