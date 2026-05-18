"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Plus, LogOut, User, Globe, ExternalLink, 
  Layout, Command, ArrowRight, ShieldCheck, 
  Image as ImageIcon, Edit2, X, Eye, Upload 
} from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";

export default function DashboardClient({ 
    initialProjects, userProfile, addProject, 
    updateProject, updateProfile, deleteProject, logout 
}: any) {
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [localImageUrl, setLocalImageUrl] = useState("");
  const [localAvatarUrl, setLocalAvatarUrl] = useState(userProfile?.avatarUrl || "");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // When opening modal, sync local state
  const openEditor = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setLocalImages(project.images || []);
      setLocalImageUrl(project.imageUrl || "");
      setIsAdding(false);
    } else {
      setEditingProject(null);
      setLocalImages([]);
      setLocalImageUrl("");
      setIsAdding(true);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls) {
        setLocalImages([...localImages, ...data.urls]);
        if (!localImageUrl && data.urls.length > 0) {
          setLocalImageUrl(data.urls[0]);
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setLocalAvatarUrl(data.urls[0]);
      }
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setLocalImages(localImages.filter(img => img !== url));
    if (localImageUrl === url) {
      setLocalImageUrl(localImages.find(img => img !== url) || "");
    }
  };

  // Unified form handler for both add and update
  const handleProjectSubmit = async (formData: FormData) => {
    // Inject local state into formData
    formData.set("images", JSON.stringify(localImages));
    formData.set("imageUrl", localImageUrl);

    try {
        if (isAdding) {
          await addProject(formData);
          showToast("Project initialized successfully");
        } else {
          await updateProject(editingProject.id, formData);
          showToast("System node updated");
        }
        setEditingProject(null);
        setIsAdding(false);
    } catch (err) {
        showToast("Operation failed", "error");
    }
  };

  const handleProfileSubmit = async (formData: FormData) => {
    try {
      await updateProfile(formData);
      showToast("Identity module updated");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this node?")) {
        try {
            await deleteProject(id);
            showToast("Node purged from database");
        } catch (err) {
            showToast("Purge failed", "error");
        }
    }
  };

  const activeProject = editingProject || (isAdding ? { title: "", category: "", description: "", link: "", github: "" } : null);

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-zinc-900 font-sans pb-32">
      
      {/* Unified Project Editor Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setEditingProject(null); setIsAdding(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] border border-zinc-100"
            >
              {/* Left: Editor Sidebar */}
              <div className="w-full md:w-1/3 bg-zinc-50 p-8 border-r border-zinc-100 overflow-y-auto shadow-inner">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-system-lime-dark mb-8 flex items-center gap-2">
                    {isAdding ? <Plus className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />} 
                    {isAdding ? "Initialize Node" : "Technical Editor"}
                 </h3>
                 <form action={handleProjectSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                           <label className="text-[8px] font-black uppercase text-zinc-400 mb-2 block">Identity</label>
                           <input name="title" defaultValue={activeProject.title} placeholder="Title" className="w-full bg-white border border-zinc-100 p-4 text-xs rounded-xl outline-none focus:border-system-lime" required />
                        </div>
                        <div className="group">
                           <label className="text-[8px] font-black uppercase text-zinc-400 mb-2 block">Classification</label>
                           <input name="category" defaultValue={activeProject.category} placeholder="Category" className="w-full bg-white border border-zinc-100 p-4 text-[10px] rounded-xl outline-none focus:border-system-lime font-bold uppercase" required />
                        </div>
                        <div className="group">
                           <label className="text-[8px] font-black uppercase text-zinc-400 mb-2 block">Imagery Matrix</label>
                           <div className="space-y-3">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:border-system-lime hover:bg-system-lime/10/30 transition-all">
                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploading ? (
                                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-system-lime"></div>
                                    ) : (
                                       <>
                                          <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                                          <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Upload Architecture</p>
                                       </>
                                    )}
                                 </div>
                                 <input type="file" multiple className="hidden" onChange={handleUpload} accept="image/*" />
                              </label>

                              {localImages.length > 0 && (
                                 <div className="grid grid-cols-3 gap-2 mt-4">
                                    {localImages.map((url, idx) => (
                                       <div key={idx} className={`relative aspect-square rounded-lg overflow-hidden group border-2 ${localImageUrl === url ? 'border-system-lime' : 'border-transparent'}`}>
                                          <img src={url} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                             <button type="button" onClick={() => setLocalImageUrl(url)} className="p-1 bg-white text-black rounded-md hover:bg-system-lime transition-colors"><ShieldCheck className="w-3 h-3" /></button>
                                             <button type="button" onClick={() => removeImage(url)} className="p-1 bg-white text-black rounded-md hover:bg-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        </div>
                        <div className="group">
                           <label className="text-[8px] font-black uppercase text-zinc-400 mb-2 block">External Links</label>
                           <input name="link" defaultValue={activeProject.link} placeholder="Demo URL" className="w-full bg-white border border-zinc-100 p-4 text-[10px] rounded-xl outline-none focus:border-system-lime mb-2" />
                           <input name="github" defaultValue={activeProject.github} placeholder="Github URL" className="w-full bg-white border border-zinc-100 p-4 text-[10px] rounded-xl outline-none focus:border-system-lime" />
                        </div>
                    </div>
                    <div className="group">
                       <label className="text-[8px] font-black uppercase text-zinc-400 mb-2 block">Narrative Description</label>
                       <textarea name="description" defaultValue={activeProject.description} className="w-full bg-white border border-zinc-100 p-4 text-xs rounded-xl h-40 outline-none focus:border-system-lime" required />
                    </div>
                    <SubmitButton className="w-full bg-black text-white p-5 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-system-lime-dark shadow-lg">
                        {isAdding ? "Deploy Project Node" : "Commit Updates"}
                    </SubmitButton>
                 </form>
              </div>

              {/* Right: Modal Preview */}
              <div className="flex-1 p-8 sm:p-12 overflow-y-auto bg-white relative">
                 <button onClick={() => { setEditingProject(null); setIsAdding(false); }} className="absolute top-6 right-6 p-2 hover:bg-zinc-50 rounded-full transition-colors z-20">
                    <X className="w-5 h-5 text-zinc-400" />
                 </button>
                 <div className="mb-10 opacity-30 pointer-events-none flex items-center gap-3">
                    <Eye className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Live Modal Perspective</span>
                 </div>
                 <div className="space-y-6 text-left">
                    <div className="aspect-video w-full bg-zinc-50 rounded-2xl overflow-hidden mb-8 border border-zinc-100 shadow-inner relative">
                        {localImageUrl ? (
                           <img src={localImageUrl} className="w-full h-full object-cover transition-all duration-500" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-zinc-200 uppercase font-black tracking-widest text-[10px]">No Imagery</div>
                        )}
                        <div className="absolute bottom-6 left-6">
                           <span className="px-3 py-1 bg-system-lime text-black text-[8px] font-black uppercase tracking-widest rounded-full">{activeProject.category || "Unclassified"}</span>
                        </div>
                        {localImages.length > 1 && (
                           <div className="absolute bottom-6 right-6 flex gap-1">
                              {localImages.map((_, i) => (
                                 <div key={i} className={`w-1 h-1 rounded-full ${localImages[i] === localImageUrl ? 'bg-system-lime' : 'bg-white/50'}`} />
                              ))}
                           </div>
                        )}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase leading-[0.9]">{activeProject.title || "Untitled Project"}</h2>
                    <div className="w-12 h-1 bg-system-lime rounded-full" />
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">{activeProject.description || "Awaiting narrative input..."}</p>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="border-b border-zinc-100 bg-white/70 backdrop-blur-2xl sticky top-0 z-50 px-4 sm:px-8 h-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-xs font-black rotate-3">N</div>
          <div>
             <h1 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900 font-sans">Portfolio CMS</h1>
             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Authenticated Access</p>
          </div>
        </div>
        <form action={logout}><button className="text-[10px] font-black uppercase text-zinc-400 hover:text-black transition-all px-5 py-2.5 border border-zinc-100 rounded-full">Logout</button></form>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16">
        
        {/* Profile Card */}
        <section className="space-y-8">
          <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-system-lime-dark border-b border-zinc-50 pb-4"><User className="w-4 h-4" /> Personal Information</h2>
          <div className="p-8 sm:p-10 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm">
            <form action={handleProfileSubmit} className="space-y-10 text-left">
              <input type="hidden" name="avatarUrl" value={localAvatarUrl} />
              
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="shrink-0">
                   <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-4 block">Profile Node</label>
                   <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-zinc-50 border border-zinc-100 overflow-hidden">
                         {localAvatarUrl ? (
                            <img src={localAvatarUrl} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-200 uppercase font-black tracking-widest text-xs">Void</div>
                         )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-system-lime-dark transition-colors shadow-lg border-4 border-white">
                         <Upload className="w-4 h-4" />
                         <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                      </label>
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="group">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Full Name</label>
                  <input name="name" defaultValue={userProfile?.name} placeholder="Name" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Professional Role</label>
                  <input name="role" defaultValue={userProfile?.role} placeholder="Role" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block italic font-serif">Hero Headline</label>
                  <input name="heroHeadline" defaultValue={userProfile?.heroHeadline} placeholder="Headline" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-lg font-black uppercase tracking-tighter rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block italic font-serif">Hero Subheadline</label>
                  <input name="heroSubheadline" defaultValue={userProfile?.heroSubheadline} placeholder="Subheadline" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm font-bold uppercase tracking-widest rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group md:col-span-2">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Bio / Information</label>
                  <textarea name="bio" defaultValue={userProfile?.bio} className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner h-32" />
                </div>
                <div className="group">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Contact Email</label>
                  <input name="contactEmail" defaultValue={userProfile?.contactEmail} placeholder="Email" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group">
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Location</label>
                  <input name="location" defaultValue={userProfile?.location} placeholder="Location" className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group">
                   <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Github URL</label>
                   <input name="social_github" defaultValue={userProfile?.socials?.github} placeholder="https://github.com/..." className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
                <div className="group">
                   <label className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-3 block">Linkedin URL</label>
                   <input name="social_linkedin" defaultValue={userProfile?.socials?.linkedin} placeholder="https://linkedin.com/in/..." className="w-full bg-zinc-50 border border-zinc-100 p-5 text-sm rounded-2xl outline-none focus:border-system-lime/50 shadow-inner" />
                </div>
              </div>
              </div>
              <button className="w-full bg-black text-white p-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-system-lime-dark transition-all shadow-lg active:scale-95">Update Identity Module</button>
            </form>
          </div>
        </section>

        {/* Project Gallery */}
        <section className="space-y-8">
          <div className="flex justify-between items-end border-b border-zinc-50 pb-4">
             <h2 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-system-lime-dark"><Layout className="w-4 h-4" /> Current Portfolio</h2>
             <button 
               onClick={() => openEditor()} 
               className="bg-system-lime/10 text-system-lime-dark px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-system-lime-dark hover:text-white transition-all flex items-center gap-2"
             >
               <Plus className="w-3.5 h-3.5" /> Initialize New Node
             </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {initialProjects.map((p: any) => (
              <div key={p.id} className="group bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[350px] relative transition-all hover:shadow-2xl">
                <div className="h-44 bg-zinc-50 relative overflow-hidden">
                  {p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button onClick={() => openEditor(p)} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl"><Edit2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                   <div>
                     <span className="text-[8px] font-black uppercase text-system-lime-dark bg-system-lime/10 px-2 py-1 rounded-full">{p.category}</span>
                     <h3 className="text-lg font-black uppercase tracking-tighter mt-3">{p.title}</h3>
                   </div>
                   <div className="flex justify-between items-center pt-6 border-t border-zinc-50 mt-4">
                      <button onClick={() => openEditor(p)} className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-system-lime-dark flex items-center gap-2 transition-colors"><Eye className="w-3 h-3" /> Edit & Preview</button>
                      <button className="p-2 text-zinc-200 hover:text-red-500 transition-colors" onClick={() => handleDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[400]"
          >
            <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-black text-white border-system-lime/20' : 'bg-red-500 text-white border-red-600'}`}>
              {toast.type === 'success' ? <ShieldCheck className="w-4 h-4 text-system-lime" /> : <X className="w-4 h-4 text-white" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
