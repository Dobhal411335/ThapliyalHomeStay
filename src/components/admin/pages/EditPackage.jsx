'use client'

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { NumericFormat } from "react-number-format"
import { usePackage } from "@/components/admin/context/PackageContext"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
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
  Table as TableIcon, // For table
  Plus, // For adding rows/columns
  Minus, // For deleting rows/columns
  Merge as MergeIcon, // For merging cells
  Scissors, // For splitting cells
} from 'lucide-react'
import { Switch } from "@/components/ui/switch";
import { tableExtensions } from '@/components/admin/common/tiptap-table-extensions';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import SeoFields from "@/components/admin/common/SeoFields"

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
        parseHTML: element => element.style.lineHeight,
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
            default: '1',
            parseHTML: element => element.style.lineHeight,
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
        return chain().setMark('textStyle', { lineHeight });
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
        <div className="absolute left-1/2 top-12 -translate-x-1/2 z-50 bg-white border border-border rounded shadow-lg p-4 flex flex-col items-center min-w-[220px]">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="url-input" className="font-ui text-sm text-heading">Enter URL</Label>
            <input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="border border-border px-2 py-1 rounded-[var(--radius-input)] w-full"
              placeholder="https://example.com"
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowUrlPopup(false)} className="px-3 py-1 rounded bg-border hover:bg-border">Cancel</button>
              <button type="button" onClick={handleUrlSubmit} className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-hover">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Controls Group */}
      <div className="flex items-center gap-1 border-r border-border pr-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={`p-2 rounded hover:bg-surface ${editor.isActive('table') ? 'bg-border' : ''}`}
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().addColumnBefore() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().addColumnBefore()}
          title="Add Column Before"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().addColumnAfter() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().addColumnAfter()}
          title="Add Column After"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().addRowBefore() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().addRowBefore()}
          title="Add Row Before"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().addRowAfter() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().addRowAfter()}
          title="Add Row After"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().deleteColumn() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().deleteColumn()}
          title="Delete Column"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().deleteRow() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().deleteRow()}
          title="Delete Row"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteTable().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().deleteTable() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().deleteTable()}
          title="Delete Table"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().mergeCells().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().mergeCells() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().mergeCells()}
          title="Merge Cells"
        >
          <MergeIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().splitCell().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().splitCell() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().splitCell()}
          title="Split Cell"
        >
          <Scissors className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().toggleHeaderRow() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().toggleHeaderRow()}
          title="Toggle Header Row"
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          className={`p-2 rounded hover:bg-surface ${!editor.can().toggleHeaderColumn() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!editor.can().toggleHeaderColumn()}
          title="Toggle Header Column"
        >
          <TableIcon className="w-4 h-4" />
        </button>
      </div>

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
          className="p-1 rounded bg-transparent border border-border hover:bg-surface"
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
          className="p-1 rounded bg-transparent border border-border hover:bg-surface"
          onChange={e => {
            if (e.target.value) {
              editor.chain().focus().setLineHeight(e.target.value).run()
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

const EditPackage = () => {
  const { handleSubmit, register, getValues, setValue, reset, watch } = useForm()
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [image, setImage] = useState(null)
  const [imageKey, setImageKey] = useState(null)

  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailKey, setThumbnailKey] = useState(null)
  const bannerInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)

  let packages = usePackage()

  const handleImageChange = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'thumbnail') {
      setThumbnailUploading(true);
      setThumbnailLoading(true);
    } else {
      setBannerUploading(true);
      setBannerLoading(true);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cloudinary", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Image upload failed");

      const result = await res.json();

      if (target === 'thumbnail') {
        setThumbnail(result.url);
        setThumbnailKey(result.key);
        setValue('basicDetails.thumbnail.url', result.url);
        setValue('basicDetails.thumbnail.key', result.key);
      } else {
        setImage(result.url);
        setImageKey(result.key);
        setValue('basicDetails.imageBanner.url', result.url);
        setValue('basicDetails.imageBanner.key', result.key);
      }

      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
      if (target === 'thumbnail') {
        setThumbnail(null);
        setThumbnailKey(null);
        setThumbnailLoading(false);
      } else {
        setImage(null);
        setImageKey(null);
        setBannerLoading(false);
      }
    } finally {
      if (e.target) e.target.value = "";
      if (target === 'thumbnail') {
        setThumbnailUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle.configure({
        types: ['textStyle']
      }),
      FontSize,
      LineHeight,
      FontFamily,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Color,
      ListItem,
      ...tableExtensions,
    ],
    content: packages?.basicDetails?.fullDesc || '',
    onUpdate: ({ editor }) => {
      setValue('basicDetails.fullDesc', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    }
  })

  useEffect(() => {
    if (packages) {
      setValue("packageName", packages.packageName);
      setValue("titleLine", packages.titleLine || "");
      setValue("keywords", Array.isArray(packages.keywords) ? packages.keywords.filter(Boolean) : []);
      setValue("price", packages.price);
      setValue("priceUsd", packages.priceUsd || 0);
      setValue("doubleOccupancyPrice", packages.doubleOccupancyPrice || 0);
      setValue("doubleOccupancyPriceUsd", packages.doubleOccupancyPriceUsd || 0);
      setValue("priceUnit", packages.priceUnit);
      setValue("basicDetails.location", packages?.basicDetails?.location)
      setValue("basicDetails.tourType", packages?.basicDetails?.tourType)
      setValue("basicDetails.duration", packages?.basicDetails?.duration)
      setValue("basicDetails.notice", packages?.basicDetails?.notice)
      setValue("basicDetails.smallDesc", packages?.basicDetails?.smallDesc)
      setValue("basicDetails.fullDesc", packages?.basicDetails?.fullDesc)
      setThumbnail(packages?.basicDetails?.thumbnail?.url)
      setThumbnailKey(packages?.basicDetails?.thumbnail?.key)
      setImage(packages?.basicDetails?.imageBanner?.url)
      setImageKey(packages?.basicDetails?.imageBanner?.key)
      // Initialize highlights from existing data
      if (packages?.basicDetails?.highlights?.length > 0) {
        setEditHighlights(packages.basicDetails.highlights.map(h => ({
          highlightName: h.highlightName || '',
          highlightDesc: h.highlightDesc?.length > 0 ? [...h.highlightDesc] : ['']
        })));
      }
      // Initialize table data from existing data
      if (packages?.basicDetails?.tableData?.length > 0) {
        setEditTableData(packages.basicDetails.tableData.map(t => ({
          tableName: t.tableName || '',
          tableDesc: t.tableDesc?.length > 0 ? [...t.tableDesc] : ['', '']
        })));
      }
      // Initialize night stops from existing data
      if (packages?.basicDetails?.nightStops?.length > 0) {
        setEditNightStops([...packages.basicDetails.nightStops]);
      }
    }
  }, [packages, setValue]);
  // Highlights state: array of { highlightName: '', highlightDesc: [''] }
  const [highlights, setHighlights] = useState([]);
  const [editHighlights, setEditHighlights] = useState([]);

  // Table state: array of { tableName: '', tableDesc: ['', ''] } (pairs of 2 columns)
  const [tableData, setTableData] = useState([]);
  const [editTableData, setEditTableData] = useState([]);

  // Night Stops state: array of strings
  const [editNightStops, setEditNightStops] = useState([]);

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

  // --- Night Stops Helpers ---
  const addNightStop = (setter) => setter(prev => [...prev, '']);
  const removeNightStop = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx));
  const updateNightStop = (setter, idx, val) => setter(prev => { const u = [...prev]; u[idx] = val; return u; });
  const [showNotice, setShowNotice] = useState(!!watch('basicDetails.notice'));

  const handleBannerUpload = async (file) => {
    setBannerLoading(true);
    setImage(file[0]?.url || file[0]?.ufsUrl || null);
    setImageKey(file[0]?.key || null);
  };

  const handleBannerLoad = () => {
    setBannerLoading(false);
  };

  const handleRemoveBanner = async () => {
    if (imageKey) {
      try {
        const response = await fetch("/api/cloudinary", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: imageKey, resourceType: "image" }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        setImage(null);
        setImageKey(null);
        setValue('basicDetails.imageBanner.url', '');
        setValue('basicDetails.imageBanner.key', '');
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };
  const handleThumbnailLoad = () => {
    setThumbnailLoading(false);
  };

  const handleRemoveThumbnail = async () => {
    if (thumbnailKey) {
      try {
        const response = await fetch("/api/cloudinary", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: thumbnailKey, resourceType: "image" }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        setThumbnail(null);
        setThumbnailKey(null);
        setValue('basicDetails.thumbnail.url', '');
        setValue('basicDetails.thumbnail.key', '');
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const onSubmit = async (data) => {
    data.pkgId = packages._id
    data.packageCode = packages.packageCode

    // Ensure nested object exists before attaching dynamic sections.
    data.basicDetails = data.basicDetails || {};

    const normalizedHighlights = editHighlights
      .map((h) => ({
        highlightName: (h.highlightName || '').trim(),
        highlightDesc: (h.highlightDesc || []).map((d) => (d || '').trim()).filter(Boolean),
      }))
      .filter((h) => h.highlightName !== '');

    const normalizedTableData = editTableData
      .map((t) => ({
        tableName: (t.tableName || '').trim(),
        tableDesc: (t.tableDesc || []).map((d) => (d || '').trim()).filter(Boolean),
      }))
      .filter((t) => t.tableName !== '');

    // Attach highlights, table data, and night stops to basicDetails.
    data.basicDetails.highlights = normalizedHighlights;
    data.basicDetails.tableData = normalizedTableData;
    data.basicDetails.nightStops = editNightStops.map(ns => (ns || '').trim()).filter(Boolean);
    data.titleLine = (data.titleLine || '').trim();
    data.keywords = Array.isArray(data.keywords)
      ? data.keywords.map((k) => (k || '').trim()).filter(Boolean)
      : [];

    if (!data.basicDetails.duration) {
      toast.error("Duration Field is required", {
        style: {
          border: "2px solid red",
          borderRadius: "10px"
        }
      })
      return
    }

    try {
      const response = await fetch("/api/admin/website-manage/addPackage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const res = await response.json()

      if (response.ok) {
        toast.success("Package updated successfully!", {
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

  return (
    <>
      <form className="flex w-full max-w-full flex-col gap-8 rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-border/50" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-heading text-3xl text-heading md:text-4xl">Basic Detail</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="packageCode" className="font-ui text-sm text-heading">Package Code</Label>
            <Input name="packageCode" readOnly value={packages?.packageCode} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="packageName" className="font-ui text-sm text-heading">Package Name</Label>
            <Input name="packageName" className="font-medium" onChange={(e) => setValue('packageName', e.target.value)} {...register('packageName')} />
          </div>
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 xl:col-span-4 rounded-[var(--radius-card)] border border-border/60 bg-card/40 p-4">
            <SeoFields
              titleLine={watch('titleLine') || ''}
              keywords={watch('keywords') || []}
              onTitleLineChange={(value) => setValue('titleLine', value)}
              onKeywordsChange={(next) => setValue('keywords', next)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price" className="font-ui text-sm text-heading">{watch('priceUnit') === "Double Occupancy Per Person Price Only" ? "Single Occupancy Price" : "Package Price"}</Label>
            <NumericFormat thousandSeparator={true} prefix="₹" name="price" className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm font-medium outline-none focus:border-primary" onValueChange={(values) => setValue('price', values.floatValue || 0)} value={watch('price') || 0} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="priceUsd" className="font-ui text-sm text-heading">{watch('priceUnit') === "Double Occupancy Per Person Price Only" ? "Single Occupancy Price ($)" : "Package Price ($)"}</Label>
            <NumericFormat thousandSeparator={true} prefix="$" name="priceUsd" className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm font-medium outline-none focus:border-primary" onValueChange={(values) => setValue('priceUsd', values.floatValue || 0)} value={watch('priceUsd') || 0} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="priceUnit" className="font-ui text-sm text-heading">Price Unit</Label>
            <select
              name="priceUnit"
              value={watch('priceUnit') || ""}
              onChange={(e) => {
                setValue('priceUnit', e.target.value);
                if (e.target.value !== "Double Occupancy Per Person Price Only") {
                  setValue('doubleOccupancyPrice', 0);
                  setValue('doubleOccupancyPriceUsd', 0);
                }
              }}
              className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="" disabled className="bg-white border border-border">Select Price Unit</option>
              <option value="Single Occupancy Per Person Price Only" className="bg-white border border-border">Single Occupancy Per Person Price Only</option>
              <option value="Double Occupancy Per Person Price Only" className="bg-white border border-border">Double Occupancy Per Person Price Only</option>
            </select>

          </div>
          {watch('priceUnit') === "Double Occupancy Per Person Price Only" && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="doubleOccupancyPrice" className="font-ui text-sm text-heading">Double Occupancy Price</Label>
                <NumericFormat thousandSeparator={true} prefix="₹" name="doubleOccupancyPrice" className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm font-medium outline-none focus:border-primary" onValueChange={(values) => setValue('doubleOccupancyPrice', values.floatValue || 0)} value={watch('doubleOccupancyPrice') || 0} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="doubleOccupancyPriceUsd" className="font-ui text-sm text-heading">Double Occupancy Price($)</Label>
                <NumericFormat thousandSeparator={true} prefix="$" name="doubleOccupancyPriceUsd" className="h-8 w-full rounded-[var(--radius-input)] border border-border bg-transparent px-2.5 py-1 text-sm font-medium outline-none focus:border-primary" onValueChange={(values) => setValue('doubleOccupancyPriceUsd', values.floatValue || 0)} value={watch('doubleOccupancyPriceUsd') || 0} />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="location" className="font-ui text-sm text-heading">Location</Label>
            <Input name="location" className="font-medium" onChange={(e) => setValue('basicDetails.location', e.target.value)} {...register('basicDetails.location')} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tourType" className="font-ui text-sm text-heading">Tour Type</Label>
            <Input type={'text'} name="tourType" className="font-medium" onChange={(e) => setValue('basicDetails.tourType', e.target.value)} {...register('basicDetails.tourType')} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration" className="font-ui text-sm text-heading">Duration (No. of Days)</Label>
            <Input type={'number'} min={1} name="duration" className="font-medium" onChange={(e) => setValue('basicDetails.duration', e.target.value)} {...register('basicDetails.duration')} />
          </div>
          <div className="flex flex-col gap-2 col-span-2 xl:col-span-4">
            <Label htmlFor="notice" className="font-ui text-sm text-heading">Any Important Notice Tag Line</Label>
            <div className="flex items-center gap-4">
              <Switch
                checked={showNotice}
                onCheckedChange={(checked) => {
                  setShowNotice(checked);
                  if (!checked) setValue('basicDetails.notice', '');
                }}
                id="notice-switch"
              />
              <span>{showNotice ? 'On' : 'Off'}</span>
            </div>
            {showNotice && (
              <div className="flex items-center gap-2">
                <Input
                  name="notice"
                  className="font-medium"
                  onChange={(e) => setValue('basicDetails.notice', e.target.value)}
                  value={watch('basicDetails.notice') || ''}
                  {...register('basicDetails.notice')}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setValue('basicDetails.notice', '');
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 col-span-2 xl:col-span-4">
            <Label htmlFor="nightStops" className="font-ui text-sm text-heading">Night Stops</Label>
            <div className="flex flex-wrap gap-2">
              {editNightStops.length === 0 ? (
                <p className="text-muted text-sm italic">No night stops added. Click "Add Night Stop" to add.</p>
              ) : (
                editNightStops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-surface border border-border rounded-[var(--radius-card)] px-3 py-2">
                    <Input
                      value={stop}
                      onChange={(e) => updateNightStop(setEditNightStops, idx, e.target.value)}
                      placeholder={`Stop ${idx + 1}`}
                      className="border-0 focus:outline-none focus-visible:ring-0 text-sm flex-1 bg-transparent"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeNightStop(setEditNightStops, idx)}
                      className="shrink-0 h-6 w-6"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => addNightStop(setEditNightStops)}
              className="h-8 px-3 w-fit"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Night Stop
            </Button>
          </div>
          <div className="flex flex-col gap-2 col-span-2 xl:col-span-4">
            <Label htmlFor="smallDesc" className="font-ui text-sm text-heading">Small Description</Label>
            <Textarea name="smallDesc" rows={4} className="font-medium" onChange={(e) => setValue('basicDetails.smallDesc', e.target.value)} {...register('basicDetails.smallDesc')} />
          </div>
          <div className="flex flex-col gap-2 col-span-2 xl:col-span-4 w-full">
            <Label htmlFor="fullDesc" className="font-ui text-sm text-heading">Full Description</Label>
            <div className="border border-border rounded-[var(--radius-input)]">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className="min-h-[200px] p-2 prose max-w-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* ===== EDIT HIGHLIGHTS SECTION (Full Width) ===== */}
        <div className="w-full border-t border-border pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-ui text-sm text-heading text-lg">Highlights</Label>
            <Button type="button" size="sm" onClick={() => addHighlight(setEditHighlights)} className="h-8 px-3">
              <Plus className="w-4 h-4 mr-1" /> Add Highlight
            </Button>
          </div>
          {editHighlights.length === 0 && (
            <p className="text-muted text-sm italic mb-2">No highlights added yet. Click "Add Highlight" to get started.</p>
          )}
          {editHighlights.map((hl, hIdx) => (
            <div key={hIdx} className="mb-4 border border-border rounded-[var(--radius-card)] p-4 bg-surface w-full">
              <div className="flex items-center gap-3 mb-3">
                <Input
                  value={hl.highlightName}
                  onChange={(e) => updateHighlightName(setEditHighlights, hIdx, e.target.value)}
                  placeholder="Highlight Title"
                  className="border border-border focus:outline-none focus-visible:ring-0 font-bold flex-1"
                />
                <Button type="button" size="icon" variant="destructive" onClick={() => removeHighlight(setEditHighlights, hIdx)} className="shrink-0 h-9 w-9">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                {hl.highlightDesc.map((desc, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <Input
                      value={desc}
                      onChange={(e) => updateHighlightDesc(setEditHighlights, hIdx, dIdx, e.target.value)}
                      placeholder={`Point ${dIdx + 1}`}
                      className="border border-border focus:outline-none focus-visible:ring-0 text-sm flex-1"
                    />
                    {hl.highlightDesc.length > 1 && (
                      <Button type="button" size="icon" variant="destructive" onClick={() => removeHighlightDesc(setEditHighlights, hIdx, dIdx)} className="shrink-0 h-8 w-8">
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => addHighlightDesc(setEditHighlights, hIdx)} className="ml-4 mt-2 text-primary hover:text-primary-hover h-7 text-xs border border-border">
                <Plus className="w-3 h-3 mr-1" /> Add Point
              </Button>
            </div>
          ))}
        </div>

        {/* ===== EDIT TABLE SECTION (Full Width) ===== */}
        <div className="w-full border-t border-border pt-6 mt-2">
          <div className="flex items-center justify-between mb-4">
            <Label className="font-ui text-sm text-heading text-lg">Table Data</Label>
            <Button type="button" size="sm" onClick={() => addTableEntry(setEditTableData)} className="h-8 px-3">
              <Plus className="w-4 h-4 mr-1" /> Add Table
            </Button>
          </div>
          {editTableData.length === 0 && (
            <p className="text-muted text-sm italic mb-2">No table data added yet. Click "Add Table" to get started.</p>
          )}
          {editTableData.map((tbl, tIdx) => (
            <div key={tIdx} className="mb-4 border border-border rounded-[var(--radius-card)] p-4 bg-surface w-full">
              <div className="flex items-center gap-3 mb-3">
                <Input
                  value={tbl.tableName}
                  onChange={(e) => updateTableName(setEditTableData, tIdx, e.target.value)}
                  placeholder="Table Title"
                  className="border border-border focus:outline-none focus-visible:ring-0 font-bold flex-1"
                />
                <Button type="button" size="icon" variant="destructive" onClick={() => removeTableEntry(setEditTableData, tIdx)} className="shrink-0 h-9 w-9">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 ml-4">
                {Array.from({ length: Math.ceil(tbl.tableDesc.length / 2) }, (_, rowIdx) => {
                  const colStart = rowIdx * 2;
                  return (
                    <div key={rowIdx} className="flex items-center gap-2">
                      <Input
                        value={tbl.tableDesc[colStart] || ''}
                        onChange={(e) => updateTableDesc(setEditTableData, tIdx, colStart, e.target.value)}
                        placeholder="Column 1"
                        className="border border-border focus:outline-none focus-visible:ring-0 text-sm flex-1"
                      />
                      <Input
                        value={tbl.tableDesc[colStart + 1] || ''}
                        onChange={(e) => updateTableDesc(setEditTableData, tIdx, colStart + 1, e.target.value)}
                        placeholder="Column 2"
                        className="border border-border focus:outline-none focus-visible:ring-0 text-sm flex-1"
                      />
                      {tbl.tableDesc.length > 2 && (
                        <Button type="button" size="icon" variant="destructive" onClick={() => removeTableRow(setEditTableData, tIdx, colStart)} className="shrink-0 h-8 w-8">
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => addTableRow(setEditTableData, tIdx)} className="ml-4 mt-2 text-primary hover:text-primary-hover h-7 text-xs border border-border">
                <Plus className="w-3 h-3 mr-1" /> Add Row
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2 w-full">
          <Label className="font-ui text-sm text-heading">Thumbnail</Label>
          <div className="grid grid-cols-1 w-full gap-4">
            {thumbnail ? (
              <div
                className="relative aspect-video rounded-[var(--radius-card)] h-52 w-auto mx-auto overflow-hidden border border-border group"
              >
                {thumbnailLoading && (
                  <div className="absolute inset-0 animate-pulse bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}

                <Image
                  src={thumbnail || 'https://dummyimage.com/600x400'}
                  alt={`Banner Preview`}
                  fill
                  sizes="100vw"
                  className={`object-contain w-full transition-opacity duration-500 ${thumbnailLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                  onLoad={handleThumbnailLoad}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveThumbnail(thumbnailKey)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted">No Thumbnail uploaded</p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            disabled={thumbnailUploading}
          >
            {thumbnailUploading ? "Uploading..." : "Upload Thumbnail"}
          </Button>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, 'thumbnail')}
          />
        </div>

        <div className="space-y-2 w-full">
          <Label className="font-ui text-sm text-heading">Image Main Title Banner</Label>
          <div className="grid grid-cols-1 w-full gap-4">
            {image ? (
              <div
                className="relative aspect-video rounded-[var(--radius-card)] h-52 w-full overflow-hidden border border-border group"
              >
                {bannerLoading && (
                  <div className="absolute inset-0 animate-pulse bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}

                <Image
                  src={image || 'https://dummyimage.com/600x400'}
                  alt={`Banner Preview`}
                  fill
                  sizes="100vw"
                  className={`object-contain w-full transition-opacity duration-500 ${bannerLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  onLoad={handleBannerLoad}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveBanner(imageKey)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted">No Image Banner uploaded</p>
            )}
          </div>
          <Button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            disabled={bannerUploading}
          >
            {bannerUploading ? "Uploading..." : "Upload Banner Image"}
          </Button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e, 'banner')}
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </>
  )
}

export default EditPackage
