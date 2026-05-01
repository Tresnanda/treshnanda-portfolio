import { db } from "@/db";
import { projects, profile } from "@/db/schema";
import { isAuthenticated, addProject, updateProfile, deleteProject, logout } from "@/actions/admin";
import { redirect } from "next/navigation";
import { LucideTrash2 as Trash2, LucidePlus as Plus, LogOut, LucideUser as User } from "lucide-react";

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const allProjects = await db.select().from(projects).orderBy(projects.createdAt);
  const [userProfile] = await db.select().from(profile).limit(1);

  return (
    <main className="max-w-6xl mx-auto px-6 py-24">
      <div className="flex justify-between items-center mb-16">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Portfolio Control</h1>
        <form action={logout}>
          <button className="flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">
            <LogOut className="w-4 h-4" /> Deauthorize
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-1 space-y-12">
          {/* Profile Form */}
          <section className="p-8 border border-white/10 bg-white/[0.02]">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-6">
              <User className="w-4 h-4" /> Identity
            </h2>
            <form action={updateProfile} className="space-y-4">
              <input name="name" defaultValue={userProfile?.name || ""} placeholder="Name" className="w-full bg-white/5 border border-white/10 p-3 text-sm" />
              <input name="role" defaultValue={userProfile?.role || ""} placeholder="Role" className="w-full bg-white/5 border border-white/10 p-3 text-sm" />
              <input name="heroHeadline" defaultValue={userProfile?.heroHeadline || ""} placeholder="Hero Headline" className="w-full bg-white/5 border border-white/10 p-3 text-sm" />
              <textarea name="heroSubheadline" defaultValue={userProfile?.heroSubheadline || ""} placeholder="Sub-headline" className="w-full bg-white/5 border border-white/10 p-3 text-sm h-24" />
              <button className="w-full bg-white text-black p-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-colors">
                Update Profile
              </button>
            </form>
          </section>

          {/* New Project Form */}
          <section className="p-8 border border-white/10 bg-white/[0.02]">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-6">
              <Plus className="w-4 h-4" /> New Project
            </h2>
            <form action={addProject} className="space-y-4">
              <input name="title" placeholder="Project Title" className="w-full bg-white/5 border border-white/10 p-3 text-sm" required />
              <input name="category" placeholder="Category (e.g. AI Architecture)" className="w-full bg-white/5 border border-white/10 p-3 text-sm" required />
              <textarea name="description" placeholder="Short description" className="w-full bg-white/5 border border-white/10 p-3 text-sm h-24" required />
              <input name="link" placeholder="External Link" className="w-full bg-white/5 border border-white/10 p-3 text-sm" />
              <input name="tags" placeholder="Tags (comma separated)" className="w-full bg-white/5 border border-white/10 p-3 text-sm" />
              <button className="w-full bg-emerald-600 text-white p-3 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">
                Commit Project
              </button>
            </form>
          </section>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Deployed Projects</h2>
          <div className="space-y-4">
            {allProjects.map((p) => (
              <div key={p.id} className="flex justify-between items-center p-6 border border-white/10 bg-white/[0.02]">
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">{p.category}</p>
                </div>
                <form action={async () => {
                  "use server";
                  await deleteProject(p.id);
                }}>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 transition-colors rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
            {allProjects.length === 0 && (
              <div className="py-20 text-center border border-dashed border-white/10 opacity-30 italic">
                No data in the buffer.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
