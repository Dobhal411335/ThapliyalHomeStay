"use client";
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {TextStyle} from '@tiptap/extension-text-style'
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
  PilcrowSquare,
} from 'lucide-react'
import SeoFields from '@/components/admin/common/SeoFields'

// Create a FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setFontStyle({ fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.setFontStyle({ fontSize: undefined })
      },
    }
  },
})

const productInfo = ({ roomData, roomId }) => {
  const [sections, setSections] = useState([]); // Array of {title, description}
  const [tableLoading, setTableLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewedSection, setViewedSection] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [description, setDescription] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [loadingGalleries, setLoadingGalleries] = useState(false);
  const imageInputRef = useRef(null);
  const [selectedMainImage, setSelectedMainImage] = useState(null); // { url, key }
  const [selectedSubImages, setSelectedSubImages] = useState([]); // array of { url, key }
  const [imageUploading, setImageUploading] = useState(false);
  const [subImagesUploading, setSubImagesUploading] = useState(false);
  const subImagesInputRef = useRef(null);

  const [editGallery, setEditGallery] = useState(null);
  const [editMainImage, setEditMainImage] = useState(null); // should be {url, key} or null
  const [editSubImages, setEditSubImages] = useState([]);
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [titleLine, setTitleLine] = useState("");
  const [keywords, setKeywords] = useState([]);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Link,
      Color,
      ListItem,
      FontSize,
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] border border-border rounded-card p-3 font-body text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/30'
      }
    }
  });

  useEffect(() => {
    if (!roomId) return;
    const fetchRoomInfo = async () => {
      try {
        const res = await fetch(`/api/roomInfo?roomId=${roomId}`);
        const data = await res.json();
        if (res.ok && data.room) {
          setHeading(data.room.heading || "");
          setParagraph(data.room.paragraph || "");
          setTitleLine(data.room.titleLine || "");
          setKeywords(
            Array.isArray(data.room.keywords)
              ? data.room.keywords.filter(Boolean)
              : []
          );
          setSelectedMainImage(data.room.mainPhoto || null);
          setSelectedSubImages(data.room.relatedPhotos || []);
          if (editor && data.room.paragraph) {
            editor.commands.setContent(data.room.paragraph, false);
          }
        }
      } catch (err) {
        // Optionally toast error
      }
    };
    fetchRoomInfo();
  }, [roomId, editor]);



  const [viewGallery, setViewGallery] = useState(null)

  // Remove uploaded main image before save
  const handleRemoveMainImageUpload = async () => {
    if (selectedMainImage && selectedMainImage.key) {
      toast.loading('Deleting main image from Cloudinary...', { id: 'cloud-delete-main' });
      try {
        const res = await fetch('/api/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: selectedMainImage.key }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success('Main image deleted from Cloudinary!', { id: 'cloud-delete-main' });
        } else {
          toast.error('Cloudinary error: ' + (data.error || 'Failed to delete main image'), { id: 'cloud-delete-main' });
        }
      } catch (err) {
        toast.error('Failed to delete main image from Cloudinary (network or server error)', { id: 'cloud-delete-main' });
      }
    }
    setSelectedMainImage(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  // Remove uploaded sub image before save
  const handleRemoveSubImageUpload = async (idx) => {
    const img = selectedSubImages[idx];
    if (img && img.key) {
      toast.loading('Deleting sub image from Cloudinary...', { id: 'cloud-delete-sub' });
      try {
        const res = await fetch('/api/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: img.key }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success('Sub image deleted from Cloudinary!', { id: 'cloud-delete-sub' });
        } else {
          toast.error('Cloudinary error: ' + (data.error || 'Failed to delete sub image'), { id: 'cloud-delete-sub' });
        }
      } catch (err) {
        toast.error('Failed to delete sub image from Cloudinary (network or server error)', { id: 'cloud-delete-sub' });
      }
    }
    setSelectedSubImages(prev => prev.filter((_, i) => i !== idx));
  };


  // Fetch all sections for the current product
  const fetchSections = async () => {
    setTableLoading(true);
    try {
      const res = await fetch(`/api/roomInfo?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok && data.info && Array.isArray(data.info.info)) {
        setSections(data.info.info);
      } else {
        setSections([]);
        if (data.error) toast.error(data.error);
      }
    } catch (err) {
      setSections([]);
      toast.error('Error fetching product info sections.');
    } finally {
      setTableLoading(false);
    }
  };
  const handleFileUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  useEffect(() => {
    if (roomId) fetchSections();
  }, [roomId]);

  const [title, setTitle] = useState("");


  // Function to get current editor content
  const getCurrentContent = () => {
    if (editor) {
      return editor.getHTML();
    }
    return description;
  };

  const productTitle = roomData?.title || "";
  const [loading, setLoading] = useState(false);

  const openDeleteModal = (idx) => {
    setDeleteTargetIndex(idx);
    setShowDeleteModal(true);
  };

  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Image upload failed');
      const result = await res.json();
      if (editGallery) {
        setEditMainImage({ url: result.url, key: result.key });
      } else {
        setSelectedMainImage({ url: result.url, key: result.key });
      }
      toast.success('Main image uploaded successfully');
    } catch (err) {
      toast.error('Main image upload failed');
    } finally {
      setImageUploading(false);
      if (file && imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleSubImagesUploadClick = () => {
    if (subImagesInputRef.current) {
      subImagesInputRef.current.value = '';
      subImagesInputRef.current.click();
    }
  };

  const handleSubImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    // Determine current sub images state based on edit mode
    const currentSubImages = editGallery ? editSubImages : selectedSubImages;
    setSubImagesUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/cloudinary', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Sub image upload failed');
        const result = await res.json();
        uploaded.push({ url: result.url, key: result.key });
      }
      if (editGallery) {
        setEditSubImages(prev => [...prev, ...uploaded]);
      } else {
        setSelectedSubImages(prev => [...prev, ...uploaded]);
      }
      toast.success('Sub image(s) uploaded successfully');
    } catch (err) {
      toast.error('Sub image upload failed');
    } finally {
      setSubImagesUploading(false);
      if (files.length && subImagesInputRef.current) subImagesInputRef.current.value = '';
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !heading.trim()) {
      toast.error('Please provide both a main image, title and description for this section.');
      return;
    }
    setLoading(true);
    const seoPayload = {
      titleLine: titleLine.trim(),
      keywords: keywords.map((k) => (k || '').trim()).filter(Boolean),
    };
    try {
      if (editMode && editIndex !== null) {
        // PATCH to update section
        const res = await fetch('/api/roomInfo', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, heading: heading.trim(), paragraph: description, mainPhoto: selectedMainImage, relatedPhotos: selectedSubImages, ...seoPayload })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          toast.error(data.error || 'Failed to update section');
        } else {
          toast.success('Section updated successfully!');
          setTitle("");
          setDescription("");
          setEditMode(false);
          setEditIndex(null);
          fetchSections();
        }
      } else {
        // POST to add section
        const res = await fetch('/api/roomInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, heading: heading.trim(), paragraph: description, mainPhoto: selectedMainImage, relatedPhotos: selectedSubImages, ...seoPayload })
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          toast.error(data.error || 'Failed to add section');
        } else {
          toast.success('Section added successfully!');
          setTitle("");
          setDescription("");
          fetchSections();
        }
      }
    } catch (err) {
      toast.error('Error saving section.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium text-heading">
          Basic info
        </h2>
        <p className="mt-1 font-body text-sm text-muted">
          Heading, description, and gallery for this hotel.
        </p>
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Hotel name
        </label>
        <Input
          type="text"
          value={productTitle}
          disabled
          readOnly
          className="bg-surface"
        />
      </div>

      <div className="rounded-[var(--radius-card)] border border-border/60 bg-card/40 p-4">
        <SeoFields
          titleLine={titleLine}
          keywords={keywords}
          onTitleLineChange={setTitleLine}
          onKeywordsChange={setKeywords}
        />
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Hotel heading
        </label>
        <Input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="A quiet hotel overlooking the garden"
        />
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Hotel description
        </label>
        <div className="overflow-hidden rounded-card border border-border bg-card">
          {editor && (
            <>
              <div className="flex flex-wrap gap-1 border-b border-border bg-surface px-2 py-2">
                {[
                  { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
                  { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
                  { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
                  { icon: PilcrowSquare, action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive("paragraph") },
                  { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
                  { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
                  { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
                  { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
                  { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
                  { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
                  { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
                  { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
                  { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }) },
                  { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }) },
                  { icon: AlignRight, action: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }) },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.action}
                      className={`rounded-button p-2 text-heading transition-colors hover:bg-card ${item.active ? "bg-card text-primary" : ""}`}
                    >
                      <Icon className="size-4" />
                    </button>
                  );
                })}
              </div>
              <EditorContent editor={editor} className="min-h-[200px] p-3 font-body text-sm text-heading" />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Main photo
        </label>
        <div className="rounded-card border border-border bg-surface p-4">
          {(editGallery ? editMainImage?.url : selectedMainImage?.url) ? (
            <div className="relative mb-3 inline-block overflow-hidden rounded-image">
              <img
                src={editGallery ? editMainImage?.url : selectedMainImage.url}
                alt="Main hotel"
                className="max-h-40 rounded-image object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-error px-2 py-0.5 text-xs text-white"
                onClick={() => {
                  if (editGallery) setEditMainImage("");
                  else handleRemoveMainImageUpload();
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFileUpload}
              className="flex w-full flex-col items-center gap-2 rounded-image border border-dashed border-border bg-card px-6 py-10 font-body text-sm text-muted transition-colors hover:border-primary/40"
            >
              Browse image
            </button>
          )}
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleMainImageUpload}
          />
          <div className="mt-3">
            <Button type="button" variant="outline" onClick={handleFileUpload}>
              {imageUploading
                ? "Uploading…"
                : editGallery
                  ? editMainImage
                    ? "Change image"
                    : "Choose image"
                  : selectedMainImage
                    ? "Change image"
                    : "Choose image"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Gallery images
        </label>
        <div className="rounded-card border border-border bg-surface p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {(editGallery ? editSubImages : selectedSubImages).length > 0 ? (
              (editGallery ? editSubImages : selectedSubImages).map((img, idx) => (
                <div key={img.key || idx} className="relative">
                  <img
                    src={img.url}
                    alt={`Gallery ${idx + 1}`}
                    className="size-24 rounded-image object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 rounded-full bg-error px-1.5 text-xs text-white"
                    onClick={() => {
                      if (editGallery) {
                        setEditSubImages(editSubImages.filter((_, i) => i !== idx));
                      } else {
                        handleRemoveSubImageUpload(idx);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="font-body text-sm text-muted">No gallery images yet.</p>
            )}
          </div>
          <input
            type="file"
            id="subImagesUpload"
            className="hidden"
            accept="image/*"
            multiple
            ref={subImagesInputRef}
            onChange={handleSubImagesUpload}
          />
          <Button type="button" variant="outline" onClick={handleSubImagesUploadClick}>
            {subImagesUploading
              ? "Uploading…"
              : (editGallery ? editSubImages : selectedSubImages).length > 0
                ? "Add more images"
                : "Choose images"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : editGallery ? "Update" : "Save data"}
        </Button>
        {editMode && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditMode(false);
              setEditIndex(null);
              setDescription("");
              setSelectedMainImage(null);
              setSelectedSubImages([]);
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default productInfo;

