'use client'
import React, { useState, useEffect } from 'react'

const API = 'https://valore-backend-ro8e.onrender.com/api/properties'

const empty = {
  title: { geo: '', eng: '' },
  address: { geo: '', eng: '' },
  description: { geo: '', eng: '' },
  district: { geo: '', eng: '' },
  city: { geo: '', eng: '' },
  price: '',
  area: '',
  rooms: '',
  bedrooms: '',
  floor: '',
  totalFloors: '',
  buildingAge: '',
  renovation: '',
  condition: '',
}

const parse = (val) => {
  if (!val) return { geo: '', eng: '' }
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return { geo: '', eng: '' } }
}

function CommercialPanel() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [mainPhoto, setMainPhoto] = useState(null)
  const [photos, setPhotos] = useState([])
  const [existingPhotos, setExistingPhotos] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}?type=commercial`)
      const data = await res.json()
      setProperties(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openAdd = () => {
    setEditing(null)
    setForm(empty)
    setMainPhoto(null)
    setPhotos([])
    setExistingPhotos([])
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      title: parse(p.title),
      address: parse(p.address),
      description: parse(p.description),
      district: parse(p.district),
      city: parse(p.city),
      price: p.price ?? '',
      area: p.area ?? '',
      rooms: p.rooms ?? '',
      floor: p.floor ?? '',
      totalFloors: p.totalFloors ?? '',
      buildingAge: p.buildingAge ?? '',
      renovation: p.renovation ?? '',
      condition: p.condition ?? '',
    })
    setMainPhoto(null)
    setPhotos([])
    setExistingPhotos(p.photos || [])
    setShowModal(true)
  }

  const bi = (field, lang, val) => setForm(f => ({ ...f, [field]: { ...f[field], [lang]: val } }))
  const fld = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const deleteExistingPhoto = async (url) => {
    if (!confirm('ფოტო წაიშლება. დარწმუნებული ხარ?')) return
    try {
      const res = await fetch(`${API}/${editing._id}/photo`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error()
      setExistingPhotos(prev => prev.filter(p => p !== url))
    } catch {
      alert('წაშლა ვერ მოხდა')
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('type', 'commercial')
      fd.append('price', form.price)
      fd.append('area', form.area)
      if (form.rooms) fd.append('rooms', form.rooms)
      
      if (form.floor) fd.append('floor', form.floor)
      if (form.totalFloors) fd.append('totalFloors', form.totalFloors)
      if (form.buildingAge) fd.append('buildingAge', form.buildingAge)
      if (form.renovation) fd.append('renovation', form.renovation)
      if (form.condition) fd.append('condition', form.condition)
      fd.append('title', JSON.stringify(form.title))
      fd.append('address', JSON.stringify(form.address))
      fd.append('description', JSON.stringify(form.description))
      fd.append('district', JSON.stringify(form.district))
      fd.append('city', JSON.stringify(form.city))
      if (mainPhoto) fd.append('mainPhoto', mainPhoto)
      photos.forEach(p => fd.append('photos', p))

      const url = editing ? `${API}/${editing._id}` : API
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error('Failed')
      await fetchProperties()
      setShowModal(false)
    } catch (e) {
      alert('შეცდომა. სცადე თავიდან.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('დარწმუნებული ხარ რომ წაშალო?')) return
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setProperties(prev => prev.filter(p => p._id !== id))
    } catch (e) { alert('წაშლა ვერ მოხდა') }
  }

  return (
    <div>
      <div className="panel-header">
        <div className="panel-title">კომერციული <span>{properties.length} განცხადება</span></div>
        <button className="btn-add" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          დამატება
        </button>
      </div>

      {loading ? (
        <div className="panel-loading"><div className="panel-spinner" /></div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
          </svg>
          <p>კომერციული ფართები არ არის დამატებული</p>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map(p => (
            <div key={p._id} className="prop-card">
              {p.mainPhoto
                ? <img src={p.mainPhoto} alt="" className="prop-card-img" />
                : <div className="prop-card-img-placeholder">ფოტო არ არის</div>
              }
              <div className="prop-card-body">
                <div className="prop-card-title">{p.title?.geo || p.address?.geo}</div>
                <div className="prop-card-address">{p.address?.geo}</div>
                <div className="prop-card-meta">
                  <span><strong>{p.price?.toLocaleString()} ₾</strong></span>
                  <span>{p.area} მ²</span>
                  {p.rooms && <span>{p.rooms} ოთ.</span>}
                  {p.floor && <span>{p.floor}/{p.totalFloors} სართ.</span>}
                </div>
                <div className="prop-card-actions">
                  <button className="btn-edit" onClick={() => openEdit(p)}>რედაქტირება</button>
                  <button className="btn-delete" onClick={() => handleDelete(p._id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">

            <div className="modal-header">
              <div className="modal-title">{editing ? 'კომერციული ფართის რედაქტირება' : 'კომერციული ფართის დამატება'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">

              <div className="form-section-label">სათაური</div>
              <div className="form-grid" style={{marginBottom: '24px'}}>
                <div className="form-field">
                  <label className="form-label">ქართული</label>
                  <input className="form-input" value={form.title.geo} onChange={e => bi('title','geo',e.target.value)} placeholder="კომერციული ფართი" />
                </div>
                <div className="form-field">
                  <label className="form-label">English</label>
                  <input className="form-input" value={form.title.eng} onChange={e => bi('title','eng',e.target.value)} placeholder="Commercial space" />
                </div>
                <div className="form-field" />
              </div>

              <div className="form-section-label">მისამართი</div>
              <div className="form-grid" style={{marginBottom: '24px'}}>
                <div className="form-field">
                  <label className="form-label">ქალაქი — ქართული</label>
                  <input className="form-input" value={form.city.geo} onChange={e => bi('city','geo',e.target.value)} placeholder="თბილისი" />
                </div>
                <div className="form-field">
                  <label className="form-label">ქალაქი — English</label>
                  <input className="form-input" value={form.city.eng} onChange={e => bi('city','eng',e.target.value)} placeholder="Tbilisi" />
                </div>
                <div className="form-field" />
                <div className="form-field">
                  <label className="form-label">უბანი — ქართული</label>
                  <input className="form-input" value={form.district.geo} onChange={e => bi('district','geo',e.target.value)} placeholder="ვაკე" />
                </div>
                <div className="form-field">
                  <label className="form-label">უბანი — English</label>
                  <input className="form-input" value={form.district.eng} onChange={e => bi('district','eng',e.target.value)} placeholder="Vake" />
                </div>
                <div className="form-field" />
                <div className="form-field">
                  <label className="form-label">მისამართი — ქართული</label>
                  <input className="form-input" value={form.address.geo} onChange={e => bi('address','geo',e.target.value)} placeholder="ჭავჭავაძის გამზ. 14" />
                </div>
                <div className="form-field">
                  <label className="form-label">მისამართი — English</label>
                  <input className="form-input" value={form.address.eng} onChange={e => bi('address','eng',e.target.value)} placeholder="14 Chavchavadze Ave" />
                </div>
                <div className="form-field" />
              </div>

              <div className="form-section-label">დეტალები</div>
              <div className="form-grid" style={{marginBottom: '24px'}}>
                <div className="form-field">
                  <label className="form-label">ფასი (₾) *</label>
                  <input className="form-input" type="number" value={form.price} onChange={e => fld('price', e.target.value)} placeholder="120000" />
                </div>
                <div className="form-field">
                  <label className="form-label">ფართი (მ²) *</label>
                  <input className="form-input" type="number" value={form.area} onChange={e => fld('area', e.target.value)} placeholder="75" />
                </div>
                <div className="form-field">
                  <label className="form-label">ოთახები</label>
                  <input className="form-input" type="number" value={form.rooms} onChange={e => fld('rooms', e.target.value)} placeholder="3" />
                </div>
               
                <div className="form-field">
                  <label className="form-label">სართული</label>
                  <input className="form-input" type="number" value={form.floor} onChange={e => fld('floor', e.target.value)} placeholder="5" />
                </div>
                <div className="form-field">
                  <label className="form-label">სართულიანობა</label>
                  <input className="form-input" type="number" value={form.totalFloors} onChange={e => fld('totalFloors', e.target.value)} placeholder="12" />
                </div>
                <div className="form-field">
                  <label className="form-label">შენობის ასაკი</label>
                  <select className="form-select" value={form.buildingAge} onChange={e => fld('buildingAge', e.target.value)}>
                    <option value="">—</option>
                    <option value="new">ახალი</option>
                    <option value="old">ძველი</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">რემონტი</label>
                  <select className="form-select" value={form.renovation} onChange={e => fld('renovation', e.target.value)}>
                    <option value="">—</option>
                    <option value="new">ახალი</option>
                    <option value="old">ძველი</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label">მდგომარეობა</label>
                  <select className="form-select" value={form.condition} onChange={e => fld('condition', e.target.value)}>
                    <option value="">—</option>
                    <option value="black">შავი კარკასი</option>
                    <option value="white">თეთრი კარკასი</option>
                    <option value="green">მწვანე კარკასი</option>
                  </select>
                </div>
              </div>

              <div className="form-section-label">აღწერა</div>
              <div className="form-grid" style={{marginBottom: '24px'}}>
                <div className="form-field" style={{gridColumn: 'span 1'}}>
                  <label className="form-label">ქართული</label>
                  <textarea className="form-textarea" value={form.description.geo} onChange={e => bi('description','geo',e.target.value)} placeholder="ფართის აღწერა..." />
                </div>
                <div className="form-field" style={{gridColumn: 'span 1'}}>
                  <label className="form-label">English</label>
                  <textarea className="form-textarea" value={form.description.eng} onChange={e => bi('description','eng',e.target.value)} placeholder="Property description..." />
                </div>
                <div className="form-field" />
              </div>

              <div className="form-section-label">ფოტოები</div>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">მთავარი ფოტო {!editing && <span style={{color:'#c0392b'}}>*</span>}</label>
                  {editing?.mainPhoto && !mainPhoto && (
                    <img src={editing.mainPhoto} alt="" style={{width:'100%', height:120, objectFit:'cover', borderRadius:8, marginBottom:8}} />
                  )}
                  {mainPhoto && (
                    <img src={URL.createObjectURL(mainPhoto)} alt="" style={{width:'100%', height:120, objectFit:'cover', borderRadius:8, marginBottom:8}} />
                  )}
                  <input className="form-file" type="file" accept="image/*" onChange={e => setMainPhoto(e.target.files[0])} />
                  {!mainPhoto && editing?.mainPhoto && <span className="form-file-name" style={{color:'#888'}}>ახალი არ არის არჩეული — ძველი დარჩება</span>}
                  {mainPhoto && <span className="form-file-name">✓ {mainPhoto.name}</span>}
                </div>

                <div className="form-field">
                  <label className="form-label">დამატებითი ფოტოები</label>
                  {existingPhotos.length > 0 && (
                    <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:8}}>
                      {existingPhotos.map((url, i) => (
                        <div key={i} style={{position:'relative'}}>
                          <img src={url} alt="" style={{width:80, height:80, objectFit:'cover', borderRadius:6, display:'block'}} />
                          <button
                            onClick={() => deleteExistingPhoto(url)}
                            style={{
                              position:'absolute', top:2, right:2,
                              background:'rgba(0,0,0,0.6)', border:'none',
                              borderRadius:'50%', width:20, height:20,
                              color:'#fff', cursor:'pointer', fontSize:14,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              padding:0, lineHeight:1,
                            }}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input className="form-file" type="file" accept="image/*" multiple onChange={e => setPhotos(Array.from(e.target.files))} />
                  {photos.length > 0 && <span className="form-file-name">✓ {photos.length} ახალი ფოტო</span>}
                  {existingPhotos.length > 0 && photos.length === 0 && <span className="form-file-name" style={{color:'#888'}}>ახალი არ არის არჩეული — ძველები დარჩება</span>}
                </div>
                <div className="form-field" />
              </div>

            </div>

            <div className="modal-footer">
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>გაუქმება</button>
                <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                  {saving && <span className="panel-spinner" style={{width:16,height:16,borderWidth:2}} />}
                  {editing ? 'შენახვა' : 'დამატება'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default CommercialPanel