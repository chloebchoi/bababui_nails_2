'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type GalleryImage = {
  name: string
  url: string
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
  }
    const fetchImages = async () => {
    const { data, error } = await supabase.storage.from('gallery-images').list('', {
        sortBy: { column: 'created_at', order: 'desc' }
    })
    console.log('gallery data:', data, 'error:', error)
    if (data) {
        setImages(data.map(file => ({
        name: file.name,
        url: supabase.storage.from('gallery-images').getPublicUrl(file.name).data.publicUrl
        })))
    }
    setLoading(false)
    }
    

  useEffect(() => {
    checkAuth()
    fetchImages()
  }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('gallery-images').upload(fileName, file)
        if (error) console.log('upload error:', error)
        else console.log('uploaded:', fileName)
    }
    await fetchImages()
    setUploading(false)
    e.target.value = ''
    }

  const handleDelete = async (name: string) => {
    await supabase.storage.from('gallery-images').remove([name])
    fetchImages()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light text-stone-800 mb-8">Gallery</h1>

      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
        <p className="text-sm text-stone-500 mb-4">Upload photos to your gallery. You can select multiple at once.</p>
        <label className={`inline-block px-4 py-2 bg-stone-800 text-white text-sm rounded-lg cursor-pointer hover:bg-stone-700 transition-colors ${uploading ? 'opacity-40 pointer-events-none' : ''}`}>
          {uploading ? 'Uploading...' : 'Choose Photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading && <p className="text-stone-400 text-sm">Loading...</p>}

      {!loading && images.length === 0 && (
        <p className="text-stone-400 text-sm">No photos yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(img => (
          <div key={img.name} className="relative group">
            <Image
            src={img.url}
            alt="Nail art"
            width={400}
            height={400}
            unoptimized
            className="w-full aspect-square object-cover rounded-xl"
            />
            <button
              onClick={() => handleDelete(img.name)}
              className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}