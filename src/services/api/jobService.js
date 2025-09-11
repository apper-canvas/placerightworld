import jobsData from "@/services/mockData/jobs.json";

class JobService {
  constructor() {
    this.jobs = [...jobsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.jobs];
  }

  async getById(id) {
    await this.delay(200);
    const job = this.jobs.find(j => j.Id === parseInt(id));
    if (!job) {
      throw new Error("Job not found");
    }
    return { ...job };
  }

  async create(jobData) {
    await this.delay(400);
    const newJob = {
      ...jobData,
      Id: Math.max(...this.jobs.map(j => j.Id)) + 1,
      postedDate: new Date().toISOString(),
      applications: []
    };
    this.jobs.push(newJob);
    return { ...newJob };
  }

  async update(id, jobData) {
    await this.delay(350);
    const index = this.jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    this.jobs[index] = { ...this.jobs[index], ...jobData };
    return { ...this.jobs[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.jobs.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Job not found");
    }
    this.jobs.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new JobService();