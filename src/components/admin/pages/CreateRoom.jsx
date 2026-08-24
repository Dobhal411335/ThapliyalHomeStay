"use client";
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import { Extension } from '@tiptap/core';
import {
  Trash2, Plus, UploadCloud,
  Bold, Italic, Underline as UnderlineIcon, PilcrowSquare,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Undo, Redo, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { ROOM_AMENITY_CATEGORIES } from "@/lib/roomAmenityCategories";
import { getRoomAmenityCategoryIcon } from "@/lib/roomAmenityIcons";

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] } },
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
});

const AMENITIES = ROOM_AMENITY_CATEGORIES.map((cat) => ({
  ...cat,
  icon: getRoomAmenityCategoryIcon(cat.category),
}));

const RoomFormEntry = ({ room, index, handleChange, handleRemoveRoom, toggleAmenity, showRemoveButton, roomData }) => {
  const editor = useEditor({
    extensions: [
      StarterKit, TextStyle, FontFamily, Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline, Link, Color, ListItem, FontSize,
    ],
    content: room.paragraph,
    onUpdate: ({ editor }) => {
      handleChange(index, 'paragraph', editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] border border-border rounded-card p-3 font-body text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent'
      }
    }
  });

  const imageInputRef = useRef(null);
  const subImagesInputRef = useRef(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [subImagesUploading, setSubImagesUploading] = useState(false);

  const handleFileUpload = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const handleSubImagesUploadClick = () => {
    if (subImagesInputRef.current) subImagesInputRef.current.click();
  };

  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cloudinary', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed');
      const result = await res.json();
      handleChange(index, 'mainPhoto', { url: result.url, key: result.key });
      toast.success('Main image uploaded');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleRemoveMainImageUpload = async () => {
    if (room.mainPhoto && room.mainPhoto.key) {
      toast.loading('Deleting main image...', { id: 'cloud-delete-main' });
      try {
        const res = await fetch('/api/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: room.mainPhoto.key }),
        });
        if (res.ok) {
          toast.success('Main image deleted!', { id: 'cloud-delete-main' });
        } else {
          toast.error('Failed to delete', { id: 'cloud-delete-main' });
        }
      } catch (err) {
        toast.error('Network error', { id: 'cloud-delete-main' });
      }
    }
    handleChange(index, 'mainPhoto', null);
  };

  const handleSubImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    setSubImagesUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/cloudinary', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Failed');
        const result = await res.json();
        uploaded.push({ url: result.url, key: result.key });
      }
      handleChange(index, 'relatedPhotos', [...room.relatedPhotos, ...uploaded]);
      toast.success('Gallery images uploaded');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setSubImagesUploading(false);
      if (subImagesInputRef.current) subImagesInputRef.current.value = '';
    }
  };

  const handleRemoveSubImageUpload = async (idx) => {
    const img = room.relatedPhotos[idx];
    if (img && img.key) {
      toast.loading('Deleting sub image...', { id: 'cloud-delete-sub' });
      try {
        const res = await fetch('/api/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: img.key }),
        });
        if (res.ok) {
          toast.success('Sub image deleted!', { id: 'cloud-delete-sub' });
        } else {
          toast.error('Failed to delete', { id: 'cloud-delete-sub' });
        }
      } catch (err) {
        toast.error('Network error', { id: 'cloud-delete-sub' });
      }
    }
    const updated = room.relatedPhotos.filter((_, i) => i !== idx);
    handleChange(index, 'relatedPhotos', updated);
  };

  return (
    <div className="border border-border rounded-xl p-6 bg-card space-y-6 relative">
      <div className="flex justify-between items-center border-b border-border pb-4">
        <h3 className="font-heading text-lg font-semibold">Room {index + 1}</h3>
        {showRemoveButton && (
          <Button type="button" variant="destructive" size="sm" className="text-black" onClick={() => handleRemoveRoom(index)}>
            <Trash2 className="w-4 h-4 mr-2" /> Remove Room
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Hotel name
          </label>
          <Input
            type="text"
            value={roomData.title}
            disabled
            readOnly
            className="bg-surface"
          />
        </div>
          <div className="space-y-2">
          <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Room name
          </label>
          <Input
            type="text"
            value={room.name}
            onChange={e => handleChange(index, 'name', e.target.value)}
            placeholder="Enter Room Name Here"
            className="bg-surface"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Single Occupancy Price (Rs.)</Label>
          <Input
            type="number"
            value={room.singleOccupancyPrice}
            onChange={e => handleChange(index, 'singleOccupancyPrice', e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Double Occupancy Price (Rs.)</Label>
          <Input
            type="number"
            value={room.doubleOccupancyPrice}
            onChange={e => handleChange(index, 'doubleOccupancyPrice', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Room description
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

      <div className="space-y-4">
        <Label className="text-base font-semibold">Room Amenities</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AMENITIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={i} className="space-y-3 bg-surface p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <Icon className="w-5 h-5" /> {cat.category}
                </div>
                <div className="flex flex-col gap-2">
                  {cat.items.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${index}-${item}`}
                        checked={room.amenities.includes(item)}
                        onCheckedChange={() => toggleAmenity(index, item)}
                      />
                      <label htmlFor={`amenity-${index}-${item}`} className="text-sm cursor-pointer select-none">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Main photo
        </label>
        <div className="rounded-card border border-border bg-surface p-4">
          {room.mainPhoto?.url ? (
            <div className="relative mb-3 inline-block overflow-hidden rounded-image">
              <img
                src={room.mainPhoto.url}
                alt="Main room"
                className="max-h-40 rounded-image object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-error px-2 py-0.5 text-xs text-white"
                onClick={handleRemoveMainImageUpload}
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
            className="hidden"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleMainImageUpload}
          />
          <div className="mt-3">
            <Button type="button" variant="outline" onClick={handleFileUpload}>
              {imageUploading ? "Uploading…" : room.mainPhoto ? "Change image" : "Choose image"}
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
            {room.relatedPhotos.length > 0 ? (
              room.relatedPhotos.map((img, idx) => (
                <div key={img.key || idx} className="relative">
                  <img
                    src={img.url}
                    alt={`Gallery ${idx + 1}`}
                    className="size-24 rounded-image object-cover"
                  />
                  <button
                    type="button"
                    className="absolute -right-1 -top-1 rounded-full bg-error px-1.5 text-xs text-white"
                    onClick={() => handleRemoveSubImageUpload(idx)}
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
            className="hidden"
            accept="image/*"
            multiple
            ref={subImagesInputRef}
            onChange={handleSubImagesUpload}
          />
          <Button type="button" variant="outline" onClick={handleSubImagesUploadClick}>
            {subImagesUploading
              ? "Uploading…"
              : room.relatedPhotos.length > 0
                ? "Add more images"
                : "Choose images"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CreateRoom = ({ hotelId, roomData, roomId }) => {
  const productTitle = roomData?.title || "";

  const [rooms, setRooms] = useState([{
    id: Date.now(),
    title: '',
    name: '',
    singleOccupancyPrice: '',
    doubleOccupancyPrice: '',
    amenities: [],
    paragraph: '',
    mainPhoto: null,
    relatedPhotos: []
  }]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/hotel/create?hotelId=${hotelId}`);
        const data = await res.json();
        if (res.ok && data.hotel && data.hotel.rooms && data.hotel.rooms.length > 0) {
          const fetchedRooms = data.hotel.rooms.map((r, index) => ({
            id: r._id || Date.now() + index,
            _id: r._id,
            title: r.title || '',
            name: r.name || '',
            singleOccupancyPrice: r.singleOccupancyPrice || '',
            doubleOccupancyPrice: r.doubleOccupancyPrice || '',
            amenities: r.amenities || [],
            paragraph: r.paragraph || '',
            mainPhoto: r.mainPhoto || null,
            relatedPhotos: r.relatedPhotos || []
          }));
          setRooms(fetchedRooms);
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, [hotelId]);

  const handleAddRoom = () => {
    setRooms([...rooms, {
      id: Date.now(),
      title: '',
      name: '',
      singleOccupancyPrice: '',
      doubleOccupancyPrice: '',
      amenities: [],
      paragraph: '',
      mainPhoto: null,
      relatedPhotos: []
    }]);
  };

  const handleRemoveRoom = (index) => {
    if (rooms.length === 1) return;
    const updated = [...rooms];
    updated.splice(index, 1);
    setRooms(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rooms];
    updated[index][field] = value;
    setRooms(updated);
  };

  const toggleAmenity = (index, amenity) => {
    const updated = [...rooms];
    const room = updated[index];
    if (room.amenities.includes(amenity)) {
      room.amenities = room.amenities.filter(a => a !== amenity);
    } else {
      room.amenities.push(amenity);
    }
    setRooms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hotelId) {
      toast.error("Hotel ID is missing.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        hotelId,
        rooms: rooms.map(r => ({
          _id: r._id,
          title: roomData?.title,
          name: r.name,
          singleOccupancyPrice: Number(r.singleOccupancyPrice) || 0,
          doubleOccupancyPrice: Number(r.doubleOccupancyPrice) || 0,
          amenities: r.amenities,
          paragraph: r.paragraph,
          mainPhoto: r.mainPhoto,
          relatedPhotos: r.relatedPhotos
        }))
      };

      const res = await fetch('/api/hotel/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      toast.success('Rooms added successfully!');
      
      // Re-fetch rooms to ensure all rooms have _id from backend
      const fetchRes = await fetch(`/api/hotel/create?hotelId=${hotelId}`);
      const fetchData = await fetchRes.json();
      if (fetchRes.ok && fetchData.hotel && fetchData.hotel.rooms) {
        setRooms(fetchData.hotel.rooms.map((r, index) => ({
          id: r._id || Date.now() + index,
          _id: r._id,
          title: r.title || '',
          name: r.name || '',
          singleOccupancyPrice: r.singleOccupancyPrice || '',
          doubleOccupancyPrice: r.doubleOccupancyPrice || '',
          amenities: r.amenities || [],
          paragraph: r.paragraph || '',
          mainPhoto: r.mainPhoto || null,
          relatedPhotos: r.relatedPhotos || []
        })));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {rooms.map((room, index) => (
        <RoomFormEntry
          roomData={roomData}
          key={room.id}
          index={index}
          room={room}
          handleChange={handleChange}
          handleRemoveRoom={handleRemoveRoom}
          toggleAmenity={toggleAmenity}
          showRemoveButton={rooms.length > 1}
        />
      ))}

      <div className="flex justify-center">
        <Button type="button" variant="outline" className="w-full md:w-auto" onClick={handleAddRoom}>
          <Plus className="w-4 h-4 mr-2" /> Add Another Room
        </Button>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving..." : "Save All Rooms"}
        </Button>
      </div>
    </form>
  );
}

export default CreateRoom;
