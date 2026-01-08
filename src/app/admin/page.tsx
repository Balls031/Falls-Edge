'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, Realtor } from '@/lib/data';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, url, onRemove }: { id: string, url: string, onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group aspect-square bg-black/40 border border-blueprint-line cursor-move">
            <img src={url} alt="Gallery" className="w-full h-full object-cover" />
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onRemove(); }}
                className="absolute top-1 right-1 bg-red-900/80 text-white text-xs px-1 hover:bg-red-700 z-50 cursor-pointer"
            >
                X
            </button>
        </div>
    );
}

export default function AdminPage() {
    const [auth, setAuth] = useState(false);
    const [pass, setPass] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [projectNumber, setProjectNumber] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [bed, setBed] = useState('');
    const [bath, setBath] = useState('');
    const [garage, setGarage] = useState('');
    const [totalSqft, setTotalSqft] = useState('');
    const [finishedSqft, setFinishedSqft] = useState('');
    const [unfinishedSqft, setUnfinishedSqft] = useState('');
    const [status, setStatus] = useState<'available' | 'sold' | 'pending'>('available');
    const [featured, setFeatured] = useState(false);
    const [imageFit, setImageFit] = useState<'contain' | 'cover' | 'fill'>('contain');
    const [qrCode, setQrCode] = useState('');
    const [openHouses, setOpenHouses] = useState<{ date: string; startTime: string; endTime: string }[]>([]);
    const [ohDate, setOhDate] = useState('');
    const [ohStart, setOhStart] = useState('');
    const [ohEnd, setOhEnd] = useState('');

    // Realtor State
    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [activeTab, setActiveTab] = useState<'projects' | 'realtors'>('projects');
    const [selectedRealtorIds, setSelectedRealtorIds] = useState<string[]>([]);

    // Realtor Form
    const [editingRealtorId, setEditingRealtorId] = useState<string | null>(null);
    const [rName, setRName] = useState('');
    const [rPhone, setRPhone] = useState('');
    const [rTitle, setRTitle] = useState('');
    const [rAgency, setRAgency] = useState('');
    const [rImageFile, setRImageFile] = useState<File | null>(null);
    const [rImageUrl, setRImageUrl] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const [gallery, setGallery] = useState<string[]>([]); // URLs
    const [blueprints, setBlueprints] = useState<string[]>([]); // URLs
    const [loading, setLoading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (auth) {
            fetchProjects();
            fetchRealtors();
        }
    }, [auth]);

    const fetchProjects = async () => {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pass === 'Xn^xn4Y**d2Jq1YkkDfQDfNbG') setAuth(true);
        else alert('Access Denied');
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) return data.url;
        throw new Error('Upload failed');
    };

    const handleGalleryUpload = async (files: FileList, type: 'gallery' | 'blueprints' = 'gallery') => {
        setLoading(true);
        try {
            const urls = await Promise.all(
                Array.from(files).map(file => handleUpload(file))
            );
            if (type === 'gallery') {
                setGallery(prev => [...prev, ...urls]);
            } else {
                setBlueprints(prev => [...prev, ...urls]);
            }
        } catch (e) {
            alert('Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const fetchRealtors = async () => {
        const res = await fetch('/api/realtors');
        const data = await res.json();
        setRealtors(data);
    };

    const handleRealtorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = rImageUrl;
            if (rImageFile) imageUrl = await handleUpload(rImageFile);

            const realtorData: Realtor = {
                id: editingRealtorId || Date.now().toString(),
                name: rName,
                phone: rPhone,
                title: rTitle,
                email: '', // Optional for now
                agency: rAgency,
                image: imageUrl
            };

            const method = editingRealtorId ? 'PUT' : 'POST';
            const res = await fetch('/api/realtors', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(realtorData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save');
            }

            fetchRealtors();
            resetRealtorForm();
            alert('Realtor Saved');
        } catch (e: any) {
            console.error(e);
            alert(`Error saving realtor: ${e.message || e}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteRealtor = async (id: string) => {
        if (!confirm('Delete this realtor?')) return;
        await fetch(`/api/realtors?id=${id}`, { method: 'DELETE' });
        fetchRealtors();
    };

    const loadRealtorForEdit = (r: Realtor) => {
        setEditingRealtorId(r.id);
        setRName(r.name || '');
        setRPhone(r.phone || '');
        setRTitle(r.title || '');
        setRAgency(r.agency || '');
        setRImageUrl(r.image || '');
        setRImageFile(null);
    };

    const resetRealtorForm = () => {
        setEditingRealtorId(null);
        setRName(''); setRPhone(''); setRTitle(''); setRAgency('');
        setRImageUrl(''); setRImageFile(null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setGallery((items) => {
                const oldIndex = items.indexOf(active.id.toString());
                const newIndex = items.indexOf(over.id.toString());
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const loadProjectForEdit = (p: Project) => {
        setEditingId(p.id);
        setProjectNumber(p.projectNumber || '');
        setTitle(p.title || '');
        setLocation(p.location || '');
        setDescription(p.description || '');
        setPrice(p.specs.price || '');
        setBed(p.specs.bed?.toString() || '');
        setBath(p.specs.bath?.toString() || '');
        setGarage(p.specs.garage?.toString() || '');
        setTotalSqft(p.specs.totalSqft || '');
        setFinishedSqft(p.specs.finishedSqft || '');
        setUnfinishedSqft(p.specs.unfinishedSqft || '');
        setStatus((p.status as any) || 'available');
        setFeatured(p.featured || false);
        setImageFit((p.imageFit as any) || 'contain');
        setQrCode(p.qrCode || '');
        setCurrentImageUrl(p.image || '');
        setGallery(p.gallery || []);
        setBlueprints(p.blueprints || (p.blueprint ? [p.blueprint] : []));
        setOpenHouses(p.openHouses || []);


        // Realtor Loading Logic
        let ids: string[] = [];
        if (p.realtors?.length) {
            ids = p.realtors.map(r => r.id).filter(id => realtors.some(existing => existing.id === id));
            if (ids.length === 0) {
                ids = p.realtors.map(r => realtors.find(existing => existing.name === r.name)?.id || '').filter(Boolean);
            }
        } else if ((p as any).realtor) {
            const legacyRealtor = (p as any).realtor;
            const match = realtors.find(r => r.id === legacyRealtor?.id || r.name === legacyRealtor?.name);
            if (match) ids = [match.id];
        }
        setSelectedRealtorIds(ids);

        setImageFile(null);
    };

    const resetForm = () => {
        setEditingId(null);
        setProjectNumber('');
        setTitle(''); setLocation(''); setDescription('');
        setPrice(''); setBed(''); setBath(''); setGarage('');
        setTotalSqft(''); setFinishedSqft(''); setUnfinishedSqft('');
        setStatus('available');
        setFeatured(false);
        setImageFit('contain');
        setQrCode('');
        setSelectedRealtorIds([]);
        setImageFile(null);
        setCurrentImageUrl('');
        setGallery([]);
        setBlueprints([]);
        setOpenHouses([]);
        setOhDate('');
        setOhStart('');
        setOhEnd('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = currentImageUrl;

            if (imageFile) imageUrl = await handleUpload(imageFile);

            if (!imageUrl) {
                alert('Main image is required.');
                setLoading(false);
                return;
            }

            const projectData: Project = {
                id: editingId || Date.now().toString(),
                projectNumber,
                title,
                location,
                description,
                image: imageUrl,
                blueprint: blueprints[0] || '', // Fallback
                blueprints,
                gallery,
                specs: {
                    totalSqft,
                    finishedSqft,
                    unfinishedSqft,
                    bed: Number(bed),
                    bath: Number(bath),
                    garage,
                    price
                },
                status,
                featured,
                imageFit,
                qrCode,
                openHouses,
                realtors: realtors.filter(r => selectedRealtorIds.includes(r.id))
            };

            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch('/api/projects', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });

            if (res.ok) {
                alert(editingId ? 'Project Updated!' : 'Project Added!');
                fetchProjects();
                resetForm();
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.details
                    ? `${errorData.error}: ${errorData.details}`
                    : (errorData.error || 'Failed to save');
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error(error);
            alert('Error saving project: ' + (error.message || error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        fetchProjects();
        if (editingId === id) resetForm();
    };

    const addOpenHouse = () => {
        if (!ohDate || !ohStart || !ohEnd) return alert('Fill all open house fields');
        setOpenHouses([...openHouses, { date: ohDate, startTime: ohStart, endTime: ohEnd }]);
        setOhDate(''); setOhStart(''); setOhEnd('');
    };

    const removeOpenHouse = (index: number) => {
        setOpenHouses(openHouses.filter((_, i) => i !== index));
    };

    const resetScans = async (projectId: string) => {
        if (!confirm('Reset scan counts for this project?')) return;
        // We can do this by updating the project with 0 counts
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const updated = { ...project, scanCount: { mobile: 0, desktop: 0 } };
        await fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        fetchProjects();
    };


    if (!auth) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-blueprint'>
                <div className="relative border border-blueprint-line p-10 max-w-sm w-full bg-blueprint/50 backdrop-blur">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blueprint-accent" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blueprint-accent" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-blueprint-accent" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blueprint-accent" />

                    <h1 className='font-architect text-3xl mb-6 text-center text-white'>Builder Access</h1>
                    <form onSubmit={handleLogin} className='space-y-6'>
                        <input type="password" value={pass} onChange={e => setPass(e.target.value)} className='w-full bg-black/40 border border-blueprint-line p-3 text-white outline-none focus:border-blueprint-accent font-mono' placeholder='ENTER KEY' />
                        <button className='w-full bg-white text-blueprint font-bold py-3 uppercase tracking-widest hover:bg-blueprint-accent hover:text-black transition-colors'>Authenticate</button>
                    </form>
                    <div className="mt-8 pt-4 border-t border-white/5 text-center">
                        <Link href="/" className='text-xs text-gray-500 hover:text-white font-mono'>&larr; RETURN TO SITE</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen p-6 pt-24 md:p-12 md:pt-40 max-w-7xl mx-auto'>
            <header className="flex justify-between items-end mb-8 border-b border-blueprint-line pb-6">
                <div>
                    <h1 className='font-architect text-4xl text-white'>Project Control</h1>
                    <p className="font-mono text-xs text-blueprint-accent mt-2 uppercase tracking-widest">Admin Dashboard</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-black/40 border border-blueprint-line">
                        <button onClick={() => setActiveTab('projects')} className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'projects' ? 'bg-blueprint-accent text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Projects</button>
                        <button onClick={() => setActiveTab('realtors')} className={`px-6 py-2 text-xs uppercase tracking-widest transition-colors ${activeTab === 'realtors' ? 'bg-blueprint-accent text-black font-bold' : 'text-gray-400 hover:text-white'}`}>Realtors</button>
                    </div>
                    <button onClick={() => setAuth(false)} className='px-4 py-2 border border-red-900/50 text-red-400 text-xs uppercase hover:bg-red-900/20 transition-colors'>Logout</button>
                </div>
            </header>

            {activeTab === 'realtors' ? (
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Realtor Editor */}
                    <div className="lg:col-span-5">
                        <div className="border border-blueprint-line p-8 bg-blueprint/30 backdrop-blur-sm relative">
                            <h2 className="text-blueprint-accent uppercase tracking-widest text-xs mb-6 border-b border-blueprint-line pb-2">{editingRealtorId ? 'Edit Realtor' : 'Add New Realtor'}</h2>
                            {editingRealtorId && <button onClick={resetRealtorForm} className="absolute top-8 right-8 text-xs text-red-400">Cancel</button>}

                            <form onSubmit={handleRealtorSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="rName" className="block text-[10px] uppercase text-gray-500 mb-1">Name</label>
                                    <input id="rName" name="name" value={rName} onChange={e => setRName(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" required placeholder="Full Name" />
                                </div>
                                <div>
                                    <label htmlFor="rTitle" className="block text-[10px] uppercase text-gray-500 mb-1">Title</label>
                                    <input id="rTitle" name="title" value={rTitle} onChange={e => setRTitle(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" required placeholder="e.g. Listing Agent" />
                                </div>
                                <div>
                                    <label htmlFor="rPhone" className="block text-[10px] uppercase text-gray-500 mb-1">Phone</label>
                                    <input id="rPhone" name="phone" value={rPhone} onChange={e => setRPhone(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" required placeholder="e.g. (605) 555-0123" />
                                </div>
                                <div>
                                    <label htmlFor="rAgency" className="block text-[10px] uppercase text-gray-500 mb-1">Agency (Optional)</label>
                                    <input id="rAgency" name="agency" value={rAgency} onChange={e => setRAgency(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="e.g. Hegg Realtors" />
                                </div>
                                <div>
                                    <label htmlFor="rImage" className="block text-[10px] uppercase text-gray-500 mb-1">Headshot</label>
                                    <input id="rImage" name="image" type="file" onChange={e => setRImageFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500" accept="image/*" />
                                    {rImageUrl && <img src={rImageUrl} className="w-20 h-20 object-cover mt-2 border border-blueprint-line" alt="Realtor headshot" />}
                                </div>
                                <button disabled={loading} className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest hover:bg-blueprint-accent transition-colors mt-4">
                                    {loading ? 'Saving...' : 'Save Realtor'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Realtor List */}
                    <div className="lg:col-span-7 space-y-4">
                        {realtors.map(r => (
                            <div key={r.id} className="flex items-center gap-4 bg-black/40 border border-blueprint-line p-4">
                                <div className="w-16 h-16 bg-gray-800 shrink-0 overflow-hidden border border-blueprint-line">
                                    {r.image ? <img src={r.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👤</div>}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold">{r.name}</h3>
                                    <p className="text-xs text-blueprint-accent">{r.title} {r.agency && `• ${r.agency}`}</p>
                                    <p className="text-xs text-gray-500 mt-1">{r.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => loadRealtorForEdit(r)} className="text-xs text-blueprint-accent hover:text-white uppercase">Edit</button>
                                    <button onClick={() => deleteRealtor(r.id)} className="text-xs text-red-500 hover:text-red-400 uppercase">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Editor */}
                    <div className="lg:col-span-7">
                        <div className="border border-blueprint-line p-8 bg-blueprint/30 backdrop-blur-sm relative">
                            <div className="absolute -top-3 left-6 px-2 bg-blueprint text-blueprint-accent text-xs uppercase tracking-widest border border-blueprint-accent">
                                {editingId ? 'Edit Project' : 'New Project Entry'}
                            </div>
                            {editingId && (
                                <button onClick={resetForm} className="absolute top-4 right-4 text-xs text-red-400 hover:text-white uppercase">Cancel Edit</button>
                            )}

                            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                                {/* Project Number & Featured */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="projectNumber" className="block text-[10px] uppercase text-gray-500 mb-2">Project Number (Optional)</label>
                                        <input id="projectNumber" name="projectNumber" value={projectNumber} onChange={e => setProjectNumber(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-3 text-white focus:border-blueprint-accent outline-none font-mono text-lg" placeholder="e.g. 101" />
                                    </div>
                                    <div className="flex items-end pb-3">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-5 h-5 bg-black/20 border border-blueprint-line text-blueprint-accent focus:ring-0 rounded-none cursor-pointer" />
                                            <span className="text-xs uppercase text-gray-400 group-hover:text-white transition-colors select-none">Show on Home Page</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="title" className="block text-[10px] uppercase text-gray-500 mb-2">Project Title</label>
                                        <input id="title" name="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-3 text-white focus:border-blueprint-accent outline-none font-architect text-xl" required />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-[10px] uppercase text-gray-500 mb-2">Location</label>
                                        <input id="location" name="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-3 text-white focus:border-blueprint-accent outline-none font-mono text-sm" required />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="qrCode" className="block text-[10px] uppercase text-gray-500 mb-2">Sign ID / QR Code (e.g. sign1)</label>
                                    <input id="qrCode" name="qrCode" value={qrCode} onChange={e => setQrCode(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-3 text-white focus:border-blueprint-accent outline-none font-mono text-sm" placeholder="e.g. sign1" />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-[10px] uppercase text-gray-500 mb-2">Description</label>
                                    <textarea id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-3 text-white focus:border-blueprint-accent outline-none h-32 font-mono text-sm" required />
                                </div>

                                {/* Open Houses */}
                                <div className="p-4 border border-blueprint-line bg-white/5">
                                    <h3 className="text-xs uppercase text-blueprint-accent mb-3">Open Houses</h3>
                                    <div className="flex gap-2 mb-2 items-center">
                                        <input type="date" value={ohDate} onChange={e => setOhDate(e.target.value)} className="bg-black/40 border border-blueprint-line text-white p-3 text-sm cursor-pointer" />
                                        <div className="flex items-center gap-1">
                                            <input type="time" value={ohStart} onChange={e => setOhStart(e.target.value)} className="bg-black/40 border border-blueprint-line text-white p-3 text-lg cursor-pointer appearance-none" />
                                            <span className="text-white">-</span>
                                            <input type="time" value={ohEnd} onChange={e => setOhEnd(e.target.value)} className="bg-black/40 border border-blueprint-line text-white p-3 text-lg cursor-pointer appearance-none" />
                                        </div>
                                        <button type="button" onClick={addOpenHouse} className="px-4 py-3 bg-blueprint-accent text-black font-bold text-xs uppercase hover:brightness-110">Add</button>
                                    </div>
                                    <div className="space-y-1">
                                        {openHouses.map((oh, i) => (
                                            <div key={i} className="flex justify-between items-center bg-black/20 px-2 py-1 border border-blueprint-line/30">
                                                <span className="text-white text-xs font-mono">{oh.date} | {oh.startTime} - {oh.endTime}</span>
                                                <button type="button" onClick={() => removeOpenHouse(i)} className="text-red-500 hover:text-red-400 text-xs">X</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <input id="totalSqft" name="totalSqft" aria-label="Total SqFt" value={totalSqft} onChange={e => setTotalSqft(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Total SqFt" />
                                    <input id="finishedSqft" name="finishedSqft" aria-label="Finished SqFt" value={finishedSqft} onChange={e => setFinishedSqft(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Finished SqFt" />
                                    <input id="unfinishedSqft" name="unfinishedSqft" aria-label="Unfinished SqFt" value={unfinishedSqft} onChange={e => setUnfinishedSqft(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Unfinished SqFt" />
                                    <input id="price" name="price" aria-label="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Price" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <input id="bed" name="bed" aria-label="Beds" type="number" value={bed} onChange={e => setBed(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Beds" />
                                    <input id="bath" name="bath" aria-label="Baths" type="number" value={bath} onChange={e => setBath(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Baths" />
                                    <input id="garage" name="garage" aria-label="Garage" type="text" value={garage} onChange={e => setGarage(e.target.value)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono" placeholder="Garage" />
                                    <select id="status" name="status" aria-label="Status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono">
                                        <option value="available">Available</option>
                                        <option value="sold">Sold</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                    <select id="imageFit" name="imageFit" aria-label="Image Fit" value={imageFit} onChange={e => setImageFit(e.target.value as any)} className="w-full bg-black/20 border border-blueprint-line p-2 text-white font-mono">
                                        <option value="contain">Fit: Contain (Default)</option>
                                        <option value="cover">Fit: Cover (Crop)</option>
                                        <option value="fill">Fit: Fill (Stretch)</option>
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-blueprint-line border-dashed">
                                    <label className="block text-[10px] uppercase text-gray-500 mb-4">Assign Realtors / Contacts</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-black/20 border border-blueprint-line p-4 max-h-40 overflow-y-auto">
                                        {realtors.map(r => (
                                            <label key={r.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    value={r.id}
                                                    checked={selectedRealtorIds.includes(r.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedRealtorIds(prev => [...prev, r.id]);
                                                        } else {
                                                            setSelectedRealtorIds(prev => prev.filter(id => id !== r.id));
                                                        }
                                                    }}
                                                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blueprint-accent focus:ring-blueprint-accent"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white text-sm font-mono">{r.name}</span>
                                                    <span className="text-xs text-gray-500 uppercase">{r.title}</span>
                                                </div>
                                            </label>
                                        ))}
                                        {realtors.length === 0 && <span className="text-gray-500 text-xs italic">No realtors available. Add them in the Realtors tab.</span>}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-blueprint-line border-dashed">
                                    <label className="block text-[10px] uppercase text-gray-500 mb-4">Main Assets</label>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <label className="mb-2 block text-xs text-gray-400">Main Photo</label>
                                            <input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500" accept="image/*" />
                                            {currentImageUrl && <p className="text-[10px] text-green-500 mt-1">Current: Saved</p>}
                                        </div>
                                    </div>

                                    {/* Blueprints Section */}
                                    <label className="block text-[10px] uppercase text-gray-500 mb-2">Blueprints / Floorplans</label>
                                    <div className="grid grid-cols-4 gap-2 mb-6">
                                        {blueprints.map((url) => (
                                            <div key={url} className="relative group aspect-[3/4] bg-black/40 border border-blueprint-line">
                                                <img src={url} alt="Blueprint" className="w-full h-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={() => setBlueprints(prev => prev.filter(u => u !== url))}
                                                    className="absolute top-1 right-1 bg-red-900/80 text-white text-xs px-1 hover:bg-red-700 cursor-pointer z-20">
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                        <label className="aspect-[3/4] border border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-white cursor-pointer transition-colors">
                                            <span className="text-2xl">+</span>
                                            <input type="file" multiple onChange={e => e.target.files && handleGalleryUpload(e.target.files, 'blueprints')} className="hidden" accept="image/*" />
                                        </label>
                                    </div>

                                    <label className="block text-[10px] uppercase text-gray-500 mb-4">Gallery (Drag to Reorder)</label>
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={gallery} strategy={rectSortingStrategy}>
                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                {gallery.map((url) => (
                                                    <SortableItem key={url} id={url} url={url} onRemove={() => setGallery(g => g.filter(u => u !== url))} />
                                                ))}
                                                <label className="aspect-square border border-dashed border-gray-600 flex items-center justify-center text-gray-500 hover:text-white hover:border-white cursor-pointer transition-colors">
                                                    <span className="text-2xl">+</span>
                                                    <input type="file" multiple onChange={e => e.target.files && handleGalleryUpload(e.target.files)} className="hidden" accept="image/*" />
                                                </label>
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>

                                <button disabled={loading} className="w-full bg-blueprint-accent text-black font-bold py-4 uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] mt-4 disabled:opacity-50">
                                    {loading ? 'Processing...' : (editingId ? 'Update Project' : 'Publish to Gallery')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className='text-white font-architect text-xl mb-4'>Existing Projects</h2>
                        {projects.map(p => (
                            <div key={p.id} className='bg-black/40 border border-blueprint-line p-4 flex gap-4 backdrop-blur hover:border-blueprint-accent transition-colors group relative'>
                                <div className="w-20 h-20 bg-gray-600 shrink-0 border border-blueprint-line overflow-hidden">
                                    <img src={p.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className='text-white font-bold leading-none mb-1'>{p.title}</h3>
                                            <p className="text-[10px] text-blueprint-accent uppercase tracking-wider">{p.projectNumber ? `NO. ${p.projectNumber}` : `ID: ${p.id}`}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => loadProjectForEdit(p)} className='text-xs text-blueprint-accent hover:text-white uppercase'>Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className='text-xs text-red-500 hover:text-red-400 uppercase'>Delete</button>
                                        </div>
                                    </div>
                                    <p className='text-gray-400 text-xs mt-2 line-clamp-2'>{p.description}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 border ${p.status === 'sold' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'} uppercase`}>
                                            {p.status}
                                        </span>
                                        {p.scanCount && (
                                            <div className="flex gap-3 items-center ml-4 border-l border-gray-700 pl-4">
                                                <span className="text-sm text-gray-300 font-mono font-bold" title="Mobile Scans">
                                                    📱 {p.scanCount.mobile || 0}
                                                </span>
                                                <span className="text-sm text-gray-300 font-mono font-bold" title="Desktop Scans">
                                                    🖥️ {p.scanCount.desktop || 0}
                                                </span>
                                                <button onClick={() => resetScans(p.id)} className="text-[10px] text-red-500 hover:text-white underline ml-1 uppercase tracking-wider">Reset</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <p className="text-gray-500 text-sm font-mono italic">No projects found in database.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
