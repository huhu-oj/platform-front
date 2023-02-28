<template>
<!--  <div class="json-editor">-->
<!--    <textarea ref="textarea" />-->
<!--  </div>-->
  <MonacoEditor
      :height="height"
      class="vs"
      style="text-align: left;background-color: #fff"
      :language="language"
      :code="value"
      :editorOptions="options"
      @mounted="onMounted"
      @codeChange="onCodeChange"
  />
</template>

<script>
// import CodeMirror from 'codemirror'
// import './settings'
import MonacoEditor from 'vue-monaco-editor'
export default {
  components: {
    MonacoEditor
  },
  props: {
    value: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    language: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      editor: false,
      options: {
        theme: "vs",
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        automaticLayout: true,
        glyphMargin: true,
        showFoldingControls: "always",
        formatOnPaste: true,
        formatOnType: true,
        folding: true,
      }
    }
  },
  watch: {
    // value(value) {
    //   const editorValue = this.editor.getValue()
    //   if (value !== editorValue) {
    //     this.editor.setValue(this.value)
    //   }
    // },
    height(value) {
      this.editor.setSize('auto', this.height)
    }
  },
  mounted() {
    // this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
    //   mode: `text/x-${this.language}`,
    //   lineNumbers: true,
    //   lint: true,
    //   lineWrapping: true,
    //   tabSize: 2,
    //   cursorHeight: 0.9,
    //   // 替换主题这里需修改名称
    //   theme: 'idea',
    //   highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
    //   matchBrackets: true,
    //   autoCloseBrackets: true // 自动补全括号
    //   // readOnly: false
    // })
    // this.editor.setSize('auto', this.height)
    // this.editor.setValue(this.value)
    // this.editor.on('change', cm => {
    //   this.$emit('changed', cm.getValue())
    //   this.$emit('input', cm.getValue())
    // })
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    },
    onMounted (editor) {
      this.editor = editor;
    },
    onCodeChange(editor) {
      // console.log(editor)
      this.$emit('changed', editor.getValue())
    },
  }
}
</script>

<style scoped>
</style>
