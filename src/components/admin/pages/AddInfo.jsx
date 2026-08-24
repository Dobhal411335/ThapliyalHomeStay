'use client'

import { usePackage } from "@/components/admin/context/PackageContext"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import { Extension } from '@tiptap/core'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  PilcrowSquare, // For paragraph
} from 'lucide-react'

// Create a FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addAttributes() {
    return {
      fontSize: {
        default: '16px',
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return {
            style: `font-size: ${attributes.fontSize}`
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: '16px',
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}
              return {
                style: `font-size: ${attributes.fontSize}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize });
      },
    }
  }
})

// Create a LineHeight extension
const LineHeight = Extension.create({
  name: 'lineHeight',

  addAttributes() {
    return {
      lineHeight: {
        default: '1',
        parseHTML: element => String(element.style.lineHeight),
        renderHTML: attributes => {
          if (!attributes.lineHeight) return {}
          return {
            style: `line-height: ${attributes.lineHeight}`
          }
        }
      }
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          lineHeight: {
            default: '1.5',
            parseHTML: element => String(element.style.lineHeight),
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              return {
                style: `line-height: ${attributes.lineHeight}`
              }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setLineHeight: lineHeight => ({ chain }) => {
        return chain().setMark('textStyle', { lineHeight: String(lineHeight) });
      },
    }
  }
})

const MenuBar = ({ editor }) => {
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  if (!editor) {
    return null
  }

  const fontSizes = [
    '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'
  ]

  const lineHeights = [
    '0.5', '0.75', '1', '1.2', '1.5', '1.8', '2', '2.5', '3'
  ]

  const handleUrlSubmit = () => {
    if (urlInput) {
      editor.chain().focus().setLink({ href: urlInput }).run();
    }
    setShowUrlPopup(false);
    setUrlInput('');
  }

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-2 relative">
      {/* Text Style Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('paragraph') ? 'bg-border' : ''}`}
          title="Paragraph"
        >
          <PilcrowSquare className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('heading', { level: 1 }) ? 'bg-border' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('heading', { level: 2 }) ? 'bg-border' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('heading', { level: 3 }) ? 'bg-border' : ''}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Formatting Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('bold') ? 'bg-border' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('italic') ? 'bg-border' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('underline') ? 'bg-border' : ''}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('strike') ? 'bg-border' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: 'left' }) ? 'bg-border' : ''}`}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: 'center' }) ? 'bg-border' : ''}`}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive({ textAlign: 'right' }) ? 'bg-border' : ''}`}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Lists Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('bulletList') ? 'bg-border' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('orderedList') ? 'bg-border' : ''}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Special Formatting Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('blockquote') ? 'bg-border' : ''}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('code') ? 'bg-border' : ''}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-1 rounded cursor-pointer"
          title="Text Color"
        />
      </div>

      {/* Links Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => setShowUrlPopup(true)}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('link') ? 'bg-border' : ''}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* URL Popup Modal */}
      {showUrlPopup && (
        <div className="absolute left-1/2 top-12 -translate-x-1/2 z-50 bg-background border border-border rounded-md shadow-lg p-4 flex flex-col items-center min-w-[220px]">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="url-input" className="text-sm font-medium">Enter URL</label>
            <input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="border border-border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowUrlPopup(false)} className="px-3 py-1 rounded bg-surface border border-border hover:bg-border">Cancel</button>
              <button type="button" onClick={handleUrlSubmit} className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary-hover">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* History Group */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-surface disabled:opacity-50"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-surface disabled:opacity-50"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Font Size Dropdown */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <select
          className="p-1 rounded bg-transparent border border-border hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run()
            }
          }}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
        >
          <option value="">Font Size</option>
          {fontSizes.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Line Height Dropdown */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <select
          className="p-1 rounded bg-transparent border border-border hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setLineHeight(String(e.target.value)).run()
            }
          }}
          value={editor.getAttributes('textStyle').lineHeight || '1.5'}
        >
          <option value="">Line Height</option>
          {lineHeights.map(height => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const AddInfo = () => {
  const { handleSubmit, register, setValue, reset, watch } = useForm()
  const packages = usePackage()
  const selectedType = watch("info.typeOfSelection")

  const [editItem, setEditItem] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editorContent, setEditorContent] = useState('');

  // Highlights state: array of { highlightName: '', highlightDesc: [''] }
  const [highlights, setHighlights] = useState([]);
  const [editHighlights, setEditHighlights] = useState([]);

  // Table state: array of { tableName: '', tableDesc: ['', ''] } (pairs of 2 columns)
  const [tableData, setTableData] = useState([]);
  const [editTableData, setEditTableData] = useState([]);

  // --- Highlight Helpers ---
  const addHighlight = (setter) => setter(prev => [...prev, { highlightName: '', highlightDesc: [''] }]);
  const removeHighlight = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
  const updateHighlightName = (setter, idx, val) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], highlightName: val }; return u; });
  const addHighlightDesc = (setter, idx) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], highlightDesc: [...u[idx].highlightDesc, ''] }; return u; });
  const removeHighlightDesc = (setter, hIdx, dIdx) => setter(prev => { const u = [...prev]; u[hIdx] = { ...u[hIdx], highlightDesc: u[hIdx].highlightDesc.filter((_, i) => i !== dIdx) }; return u; });
  const updateHighlightDesc = (setter, hIdx, dIdx, val) => setter(prev => { const u = [...prev]; const d = [...u[hIdx].highlightDesc]; d[dIdx] = val; u[hIdx] = { ...u[hIdx], highlightDesc: d }; return u; });

  // --- Table Helpers ---
  const addTableEntry = (setter) => setter(prev => [...prev, { tableName: '', tableDesc: ['', ''] }]);
  const removeTableEntry = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
  const updateTableName = (setter, idx, val) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], tableName: val }; return u; });
  const addTableRow = (setter, idx) => setter(prev => { const u = [...prev]; u[idx] = { ...u[idx], tableDesc: [...u[idx].tableDesc, '', ''] }; return u; });
  const removeTableRow = (setter, tIdx, rowStart) => setter(prev => { const u = [...prev]; const d = [...u[tIdx].tableDesc]; d.splice(rowStart, 2); u[tIdx] = { ...u[tIdx], tableDesc: d }; return u; });
  const updateTableDesc = (setter, tIdx, dIdx, val) => setter(prev => { const u = [...prev]; const d = [...u[tIdx].tableDesc]; d[dIdx] = val; u[tIdx] = { ...u[tIdx], tableDesc: d }; return u; });
  const addEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.configure({ types: ['textStyle'] }),
      FontSize.configure(),
      LineHeight.configure(),
      FontFamily,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Color,
      ListItem,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setValue('info.selectionDesc', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    }
  });
  const editEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.configure({ types: ['textStyle'] }),
      FontSize.configure(),
      LineHeight.configure(),
      FontFamily,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Color,
      ListItem,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setValue('info.selectionDesc', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    }
  });

  // Filter "Day Plan" info
  const dayPlanInfo = packages.info.filter(info => info.typeOfSelection === "Day Plan")
  // Filter other info
  const otherInfo = packages.info.filter(info => info.typeOfSelection !== "Day Plan")

  useEffect(() => {
    if (isOpen && !editItem && addEditor) {
      setEditorContent('');
      setValue('info.selectionDesc', '');
      if (addEditor) addEditor.commands.setContent('');
      setHighlights([]);
      setTableData([]);
    }
  }, [isOpen, editItem, setValue]);

  useEffect(() => {
    if (editItem) {
      setEditorContent(editItem.selectionDesc || '');
      setValue('info.selectionDesc', editItem.selectionDesc || '');
      if (editEditor) editEditor.commands.setContent(editItem.selectionDesc || '');
    }
  }, [editItem, setValue]);

  const onSubmit = async (data) => {
    data.pkgId = packages._id

    // Attach highlights and table data
    data.info.selectionHighlight = highlights.filter(h => h.highlightName.trim() !== '');
    data.info.selectionTable = tableData.filter(t => t.tableName.trim() !== '');

    if (!data.info.typeOfSelection || !data.info.selectionTitle || !data.info.selectionDesc) {
      toast.error("All fields are required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
      return
    }

    const packageDuration = packages.basicDetails?.duration || 0

    // Validate Day Plan count against package duration
    if (data.info.typeOfSelection === "Day Plan" && dayPlanInfo.length >= packageDuration && !editItem) {
      toast.error(`Cannot add more Day Plans than package duration (${packageDuration} days)`, {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
      return
    }

    try {
      const response = await fetch("/api/admin/website-manage/addPackage/addInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const res = await response.json()

      if (response.ok) {
        toast.success("Info added successfully!", {
          style: {
            border: "2px solid green",
            borderRadius: "10px"
          }
        })
        window.location.reload()
      } else {
        toast.error(`Failed To Update Package: ${res.message}`, {
          style: {
            border: "2px solid red",
            borderRadius: "10px"
          }
        })
      }
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
    }
  }

  const handleUpdate = async (data) => {
    data.info._id = editItem._id;
    // Attach highlights and table data
    data.info.selectionHighlight = editHighlights.filter(h => h.highlightName.trim() !== '');
    data.info.selectionTable = editTableData.filter(t => t.tableName.trim() !== '');
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage/addInfo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pkgId: packages._id,
          info: data.info,
        }),
      });

      const res = await response.json();

      if (response.ok) {
        toast.success("Info updated successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
        window.location.reload();
        setEditItem(null);
      } else {
        toast.error(`Failed to update Info`, { style: { borderRadius: "10px", border: "2px solid red" } });
      }
    } catch (error) {
      toast.error("Error updating Info", { style: { borderRadius: "10px", border: "2px solid red" } });
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setIsOpen(true);
    setValue("info.typeOfSelection", item.typeOfSelection);
    setValue("info.selectionTitle", item.selectionTitle);
    setValue("info.selectionDesc", item.selectionDesc);
    setValue("info.order", item.order);
    // Initialize highlights
    setEditHighlights(item.selectionHighlight?.length > 0
      ? item.selectionHighlight.map(h => ({ highlightName: h.highlightName || '', highlightDesc: h.highlightDesc?.length > 0 ? [...h.highlightDesc] : [''] }))
      : []);
    // Initialize table data
    setEditTableData(item.selectionTable?.length > 0
      ? item.selectionTable.map(t => ({ tableName: t.tableName || '', tableDesc: t.tableDesc?.length > 0 ? [...t.tableDesc] : ['', ''] }))
      : []);
  };

  const deleteMenuItem = async (InfoId) => {
    const id = packages._id;
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage/addInfo`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, InfoId }),
      });

      if (response.ok) {
        toast.success("Info deleted successfully!", { style: { borderRadius: "10px", border: "2px solid green" } });
        window.location.reload();
      } else {
        toast.error("Failed to delete info", { style: { borderRadius: "10px", border: "2px solid red" } });
      }
    } catch (error) {
      console.error("Error deleting info:", error);
    }
  };

  const handleTypeChange = (value) => {
    setValue("info.typeOfSelection", value);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-8 my-20 w-full bg-surface border border-border max-w-5xl p-8 rounded-[var(--radius-card)]">
        <h1 className="text-4xl font-heading font-semibold text-heading">Add Info</h1>
        <Button
          onClick={() => setIsOpen(true)}
        >
          Add Info
        </Button>

        {dayPlanInfo.length >= packages?.basicDetails?.duration && (
          <div className="text-red-600 font-bold">
            Maximum Day Plans ({packages.basicDetails?.duration}) reached for this package
          </div>
        )}

        {/* Main Table for Non-Day Plan Info */}
        <Table className="max-w-5xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center text-heading font-semibold w-1/3">Section</TableHead>
              <TableHead className="w-1/3 text-heading font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otherInfo.length > 0 ? (
              otherInfo.sort((a, b) => a.order - b.order).map((info) => (
                <TableRow key={info._id} >
                  <TableCell className="border border-border font-medium w-5/6"><Badge className="py-1 mr-4 bg-primary text-primary-foreground border-transparent">{info?.typeOfSelection}</Badge>{info?.selectionTitle}</TableCell>
                  <TableCell className="border border-border font-medium">
                    <div className="flex items-center justify-center gap-6">
                      <Button size="icon" onClick={() => handleEdit(info)} variant="outline">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" onClick={() => deleteMenuItem(info._id)} variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))) : (
              <TableRow>
                <TableCell colSpan={4} className="border border-border font-medium text-center text-muted">
                  No Info Added
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Day Plan Table */}
        <div className="w-full max-w-5xl mt-8">
          <h2 className="text-2xl font-heading font-semibold text-heading mb-4">Day Plan Details ({dayPlanInfo.length}/{packages.basicDetails?.duration})</h2>
          <Table className="max-w-5xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-heading font-semibold w-2/3">Day</TableHead>
                <TableHead className="w-1/3 text-heading font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayPlanInfo.length > 0 ? (
                dayPlanInfo.sort((a, b) => a.order - b.order).map((info) => (
                  <TableRow key={info._id}>
                    <TableCell className="border border-border font-medium w-5/6"><Badge className="py-1 mr-4 bg-primary text-primary-foreground border-transparent">{info?.typeOfSelection}</Badge>{info.selectionTitle}</TableCell>
                    <TableCell className="border border-border font-medium">
                      <div className="flex items-center justify-center gap-6">
                        <Button size="icon" onClick={() => handleEdit(info)} variant="outline">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" onClick={() => deleteMenuItem(info._id)} variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="border border-border font-medium text-center text-muted">
                    No Day Plan Added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Info Dialogs */}
        {isOpen && (
          <Dialog open={!!isOpen} onOpenChange={() => { setIsOpen(false); window.location.reload(); }}>
            <DialogContent className="md:!max-w-3xl font-body overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add Info</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="typeOfSelection" className="font-semibold">Type Of Selection</label>
                    <Select
                      name="typeOfSelection"
                      className="p-2 border border-gray-300 rounded-md"
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger className="border-2 bg-transparent border-border focus:border-primary focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select Type Of Selection" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-border bg-surface">
                        <SelectGroup>
                          <SelectItem
                            className="focus:bg-surface font-bold"
                            value="Day Plan"
                            disabled={dayPlanInfo.length >= packages.basicDetails?.duration && !editItem}
                          >
                            Day Plan
                          </SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Inclusions">Inclusions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Exclusions">Exclusions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Location Map">Location Map</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Policy Content">Policy Content</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Frequently Asked Questions">Frequently Asked Questions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Important Information">Important Information</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {selectedType === "Day Plan" && dayPlanInfo.length >= packages.basicDetails?.duration && !editItem && (
                      <div className="text-destructive font-bold">
                        Maximum Day Plans ({packages.basicDetails?.duration}) reached for this package
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 col-span-3">
                    <Label>Main Title Heading</Label>
                    <Input {...register("info.selectionTitle")} className="border-2 border-border focus:border-dashed focus:border-primary focus:outline-none focus-visible:ring-0 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="selectionDesc" className="font-semibold">Descriptions</label>
                    <MenuBar editor={addEditor} />
                    <EditorContent
                      editor={addEditor}
                      className="h-[250px] overflow-y-auto min-h-[100px] p-2 prose max-w-none bg-transparent border border-border rounded-md"
                    />
                  </div>
                  {/* ===== HIGHLIGHTS SECTION ===== */}
                  <div className="col-span-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-semibold text-lg">Highlights</label>
                      <Button type="button" size="sm" onClick={() => addHighlight(setHighlights)} className="h-8 px-3">
                        <Plus className="w-4 h-4 mr-1" /> Add Highlight
                      </Button>
                    </div>
                    {highlights.map((hl, hIdx) => (
                      <div key={hIdx} className="mb-4 border border-border rounded-lg p-3 bg-surface">
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={hl.highlightName}
                            onChange={(e) => updateHighlightName(setHighlights, hIdx, e.target.value)}
                            placeholder="Highlight Title"
                            className="border-2 border-border focus:outline-none focus-visible:ring-0 font-bold"
                          />
                          <Button type="button" size="icon" variant="destructive" onClick={() => removeHighlight(setHighlights, hIdx)} className="shrink-0 h-9 w-9">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {hl.highlightDesc.map((desc, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 mb-1 ml-4">
                            <Input
                              value={desc}
                              onChange={(e) => updateHighlightDesc(setHighlights, hIdx, dIdx, e.target.value)}
                              placeholder={`Point ${dIdx + 1}`}
                              className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                            />
                            {hl.highlightDesc.length > 1 && (
                              <Button type="button" size="icon" variant="ghost" onClick={() => removeHighlightDesc(setHighlights, hIdx, dIdx)} className="shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="ghost" onClick={() => addHighlightDesc(setHighlights, hIdx)} className="ml-4 mt-1 text-primary hover:text-primary-hover h-7 text-xs border border-border">
                          <Plus className="w-3 h-3 mr-1" /> Add Point
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* ===== TABLE SECTION ===== */}
                  <div className="col-span-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-semibold text-lg">Table Data</label>
                      <Button type="button" size="sm" onClick={() => addTableEntry(setTableData)} className="h-8 px-3">
                        <Plus className="w-4 h-4 mr-1" /> Add Table
                      </Button>
                    </div>
                    {tableData.map((tbl, tIdx) => (
                      <div key={tIdx} className="mb-4 border border-border rounded-lg p-3 bg-surface">
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={tbl.tableName}
                            onChange={(e) => updateTableName(setTableData, tIdx, e.target.value)}
                            placeholder="Table Title"
                            className="border-2 border-border focus:outline-none focus-visible:ring-0 font-bold"
                          />
                          <Button type="button" size="icon" variant="destructive" onClick={() => removeTableEntry(setTableData, tIdx)} className="shrink-0 h-9 w-9">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {/* Rows of 2 columns */}
                        {Array.from({ length: Math.ceil(tbl.tableDesc.length / 2) }, (_, rowIdx) => {
                          const colStart = rowIdx * 2;
                          return (
                            <div key={rowIdx} className="flex items-center gap-2 mb-1 ml-4">
                              <Input
                                value={tbl.tableDesc[colStart] || ''}
                                onChange={(e) => updateTableDesc(setTableData, tIdx, colStart, e.target.value)}
                                placeholder="Column 1"
                                className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                              />
                              <Input
                                value={tbl.tableDesc[colStart + 1] || ''}
                                onChange={(e) => updateTableDesc(setTableData, tIdx, colStart + 1, e.target.value)}
                                placeholder="Column 2"
                                className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                              />
                              {tbl.tableDesc.length > 2 && (
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeTableRow(setTableData, tIdx, colStart)} className="shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                        <Button type="button" size="sm" variant="ghost" onClick={() => addTableRow(setTableData, tIdx)} className="ml-4 mt-1 text-primary hover:text-primary-hover h-7 text-xs">
                          <Plus className="w-3 h-3 mr-1" /> Add Row
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {editItem && (
          <Dialog open={!!editItem} onOpenChange={() => { setEditItem(null); window.location.reload(); }}>
            <DialogContent className="md:!max-w-3xl font-body overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Edit Info</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="typeOfSelection" className="font-semibold">Type Of Selection</label>
                    <Select name="typeOfSelection" className="p-2 border border-gray-300 rounded-md" defaultValue={editItem.typeOfSelection} onValueChange={handleTypeChange}>
                      <SelectTrigger className="border-2 bg-transparent border-border focus:border-primary focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select Type Of Selection" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-border bg-surface">
                        <SelectGroup>
                          <SelectItem className="focus:bg-surface font-bold" value="Day Plan">Day Plan</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Inclusions">Inclusions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Exclusions">Exclusions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Location Map">Location Map</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Policy Content">Policy Content</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Frequently Asked Questions">Frequently Asked Questions</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Important Information">Important Information</SelectItem>
                          <SelectItem className="focus:bg-surface font-bold" value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 col-span-3">
                    <Label>Main Title Heading</Label>
                    <Input {...register("info.selectionTitle")} className="border-2 border-border focus:border-dashed focus:border-primary focus:outline-none focus-visible:ring-0 font-bold" />
                  </div>
                  <div className="flex flex-col gap-2 col-span-4">
                    <label htmlFor="selectionDesc" className="font-semibold">Description</label>
                    <MenuBar editor={editEditor} />
                    <EditorContent
                      editor={editEditor}
                      className="h-[250px] overflow-y-auto min-h-[100px] p-2 prose max-w-none border border-border rounded-md"
                    />
                  </div>

                  {/* ===== EDIT HIGHLIGHTS SECTION ===== */}
                  <div className="col-span-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-semibold text-lg">Highlights</label>
                      <Button type="button" size="sm" onClick={() => addHighlight(setEditHighlights)} className="h-8 px-3">
                        <Plus className="w-4 h-4 mr-1" /> Add Highlight
                      </Button>
                    </div>
                    {editHighlights.map((hl, hIdx) => (
                      <div key={hIdx} className="mb-4 border border-border rounded-lg p-3 bg-surface">
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={hl.highlightName}
                            onChange={(e) => updateHighlightName(setEditHighlights, hIdx, e.target.value)}
                            placeholder="Highlight Title"
                            className="border-2 border-border focus:outline-none focus-visible:ring-0 font-bold"
                          />
                          <Button type="button" size="icon" variant="destructive" onClick={() => removeHighlight(setEditHighlights, hIdx)} className="shrink-0 h-9 w-9">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {hl.highlightDesc.map((desc, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 mb-1 ml-4">
                            <Input
                              value={desc}
                              onChange={(e) => updateHighlightDesc(setEditHighlights, hIdx, dIdx, e.target.value)}
                              placeholder={`Point ${dIdx + 1}`}
                              className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                            />
                            {hl.highlightDesc.length > 1 && (
                              <Button type="button" size="icon" variant="ghost" onClick={() => removeHighlightDesc(setEditHighlights, hIdx, dIdx)} className="shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="ghost" onClick={() => addHighlightDesc(setEditHighlights, hIdx)} className="ml-4 mt-1 text-primary hover:text-primary-hover h-7 text-xs">
                          <Plus className="w-3 h-3 mr-1" /> Add Point
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* ===== EDIT TABLE SECTION ===== */}
                  <div className="col-span-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-semibold text-lg">Table Data</label>
                      <Button type="button" size="sm" onClick={() => addTableEntry(setEditTableData)} className="h-8 px-3">
                        <Plus className="w-4 h-4 mr-1" /> Add Table
                      </Button>
                    </div>
                    {editTableData.map((tbl, tIdx) => (
                      <div key={tIdx} className="mb-4 border border-border rounded-lg p-3 bg-surface">
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={tbl.tableName}
                            onChange={(e) => updateTableName(setEditTableData, tIdx, e.target.value)}
                            placeholder="Table Title"
                            className="border-2 border-border focus:outline-none focus-visible:ring-0 font-bold"
                          />
                          <Button type="button" size="icon" variant="destructive" onClick={() => removeTableEntry(setEditTableData, tIdx)} className="shrink-0 h-9 w-9">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {Array.from({ length: Math.ceil(tbl.tableDesc.length / 2) }, (_, rowIdx) => {
                          const colStart = rowIdx * 2;
                          return (
                            <div key={rowIdx} className="flex items-center gap-2 mb-1 ml-4">
                              <Input
                                value={tbl.tableDesc[colStart] || ''}
                                onChange={(e) => updateTableDesc(setEditTableData, tIdx, colStart, e.target.value)}
                                placeholder="Column 1"
                                className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                              />
                              <Input
                                value={tbl.tableDesc[colStart + 1] || ''}
                                onChange={(e) => updateTableDesc(setEditTableData, tIdx, colStart + 1, e.target.value)}
                                placeholder="Column 2"
                                className="border border-border focus:outline-none focus-visible:ring-0 text-sm"
                              />
                              {tbl.tableDesc.length > 2 && (
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeTableRow(setEditTableData, tIdx, colStart)} className="shrink-0 h-8 w-8 text-destructive hover:text-destructive">
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                        <Button type="button" size="sm" variant="ghost" onClick={() => addTableRow(setEditTableData, tIdx)} className="ml-4 mt-1 text-primary hover:text-primary-hover h-7 text-xs">
                          <Plus className="w-3 h-3 mr-1" /> Add Row
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

      </div>
    </>
  )
}

export default AddInfo