<template>
<!--  <div class="json-editor">-->
<!--    <textarea ref="textarea" />-->
<!--  </div>-->
  <MonacoEditor
      theme="vs-dark"
      :options="options"
      :value="value"
      :height="height"
      :lang="language"
      @mounted="onMounted"
      @codeChange="onCodeChange"
  />
</template>

<script>
import MonacoEditor from 'monaco-editor-vue3'
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
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        automaticLayout: true,
        glyphMargin: true,
        showFoldingControls: "always",
        formatOnPaste: true,
        formatOnType: true,
        folding: true,
        wordWrap: "wordWrapColumn",
        inherit: true,
        // wordWrapColumn: 40,

        // Set this to false to not auto word wrap minified files
        wordWrapMinified: true,

        // try "same", "indent" or "none"
        wrappingIndent: "same",
      }
    }
  },
  mounted() {
  },
  methods: {
    getValue() {
      return this.editor.getValue()
    },
    onMounted (editor) {
      this.editor = editor;
      console.log(editor)
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
