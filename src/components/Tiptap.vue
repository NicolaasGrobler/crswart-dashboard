<template>
  <div>
    <div v-if="editor">
      <!-- Heading 1 -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        <font-awesome-icon icon="heading" /> <b>1</b>
      </b-button>
      <!-- Heading 2 -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        <font-awesome-icon icon="heading" /> <b>2</b>
      </b-button>
      <!-- Heading 3 -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
      >
        <font-awesome-icon icon="heading" /> <b>3</b>
      </b-button>
      <!-- Bold -->
      <b-button
        style="margin-right: 10px"
        type="is-editor"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <font-awesome-icon icon="bold" />
      </b-button>
      <!-- Italic -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <font-awesome-icon icon="italic" />
      </b-button>
      <!-- Strikethrough -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <font-awesome-icon icon="strikethrough" />
      </b-button>
      <!-- Blockquote -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <font-awesome-icon icon="quote-left" />
      </b-button>
      <!-- Bullet List -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <font-awesome-icon icon="list-ul" />
      </b-button>
      <!-- Ordered List -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <font-awesome-icon icon="list-ol" />
      </b-button>
      <!-- Highligt -->
      <b-button
        type="is-editor"
        style="margin-right: 10px"
        @click="editor.chain().focus().toggleHighlight().run()"
        :class="{ 'is-active': editor.isActive('highlight') }"
      >
        <font-awesome-icon icon="highlighter" />
      </b-button>
      <!-- Alignment -->
      <div class="field has-addons" style="display: inline-flex">
        <p class="control">
          <b-button
            type="is-editor"
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          >
            <font-awesome-icon icon="align-left" />
          </b-button>
        </p>
        <p class="control">
          <b-button
            type="is-editor"
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          >
            <font-awesome-icon icon="align-center" />
          </b-button>
        </p>
        <p class="control">
          <b-button
            type="is-editor"
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          >
            <font-awesome-icon icon="align-right" />
          </b-button>
        </p>
        <p class="control">
          <b-button
            type="is-editor"
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          >
            <font-awesome-icon icon="align-justify" />
          </b-button>
        </p>
      </div>
    </div>
    <editor-content
      :editor="editor"
      class="editor"
      :class="error ? 'is-danger' : ''"
      style="overflow-y: scroll"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    };
  },

  props: {
    value: {
      type: String,
      default: '',
    },
    error: Boolean
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      content: "",
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight,
      ],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style>
.editor {
  border: 1px solid rgb(235, 235, 235);
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
  outline: 0px solid transparent;
  max-height: 300px;
}

.is-danger {
  border-color: #640B26;
}

.ProseMirror:focus {
  outline: none !important;
}

mark {
  background-color: #faf594;
}

.button.is-editor:active,
.button.is-editor.is-active {
  background-color: #b89b6abd !important;
  color: white;
}
</style>
