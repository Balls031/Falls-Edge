<<<<<<< HEAD
import fs from 'fs/promises';
import path from 'path';
import { Project, PROJECTS as INITIAL_PROJECTS } from './data';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    } catch (error) {
        // ignore if exists
    }
}

export async function getProjects(): Promise<Project[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, initialize with mock data
        await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2));
        return INITIAL_PROJECTS;
    }
}

export async function saveProjects(projects: Project[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export async function addProject(project: Project): Promise<void> {
    const projects = await getProjects();
    projects.push(project);
    await saveProjects(projects);
}

export async function deleteProject(id: string): Promise<void> {
    const projects = await getProjects();
    const filtered = projects.filter(p => p.id !== id);
    await saveProjects(filtered);
}

export async function updateProject(project: Project): Promise<void> {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
        projects[index] = project;
        await saveProjects(projects);
    }
}

// --- Realtors ---

const REALTOR_FILE = path.join(process.cwd(), 'data', 'realtors.json');

export async function getRealtors(): Promise<any[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(REALTOR_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveRealtors(realtors: any[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(REALTOR_FILE, JSON.stringify(realtors, null, 2));
}

export async function addRealtor(realtor: any): Promise<void> {
    const realtors = await getRealtors();
    realtors.push(realtor);
    await saveRealtors(realtors);
}

export async function deleteRealtor(id: string): Promise<void> {
    const realtors = await getRealtors();
    const filtered = realtors.filter(r => r.id !== id);
    await saveRealtors(filtered);
}

export async function updateRealtor(realtor: any): Promise<void> {
    const realtors = await getRealtors();
    const index = realtors.findIndex(r => r.id === realtor.id);
    if (index !== -1) {
        realtors[index] = realtor;
        await saveRealtors(realtors);
    }
}
=======
import fs from 'fs/promises';
import path from 'path';
import { Project, PROJECTS as INITIAL_PROJECTS } from './data';

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    } catch (error) {
        // ignore if exists
    }
}

export async function getProjects(): Promise<Project[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, initialize with mock data
        await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_PROJECTS, null, 2));
        return INITIAL_PROJECTS;
    }
}

export async function saveProjects(projects: Project[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export async function addProject(project: Project): Promise<void> {
    const projects = await getProjects();
    projects.push(project);
    await saveProjects(projects);
}

export async function deleteProject(id: string): Promise<void> {
    const projects = await getProjects();
    const filtered = projects.filter(p => p.id !== id);
    await saveProjects(filtered);
}

export async function updateProject(project: Project): Promise<void> {
    const projects = await getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
        projects[index] = project;
        await saveProjects(projects);
    }
}

// --- Realtors ---

const REALTOR_FILE = path.join(process.cwd(), 'data', 'realtors.json');

export async function getRealtors(): Promise<any[]> {
    await ensureDataDir();
    try {
        const data = await fs.readFile(REALTOR_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveRealtors(realtors: any[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(REALTOR_FILE, JSON.stringify(realtors, null, 2));
}

export async function addRealtor(realtor: any): Promise<void> {
    const realtors = await getRealtors();
    realtors.push(realtor);
    await saveRealtors(realtors);
}

export async function deleteRealtor(id: string): Promise<void> {
    const realtors = await getRealtors();
    const filtered = realtors.filter(r => r.id !== id);
    await saveRealtors(filtered);
}

export async function updateRealtor(realtor: any): Promise<void> {
    const realtors = await getRealtors();
    const index = realtors.findIndex(r => r.id === realtor.id);
    if (index !== -1) {
        realtors[index] = realtor;
        await saveRealtors(realtors);
    }
}
>>>>>>> f23c7ec5816116c984b5737788af5cbb8de299c1
