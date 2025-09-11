import applicationsData from "@/services/mockData/applications.json";

class ApplicationService {
  constructor() {
    this.applications = [...applicationsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.applications];
  }

  async getById(id) {
    await this.delay(200);
    const application = this.applications.find(a => a.Id === parseInt(id));
    if (!application) {
      throw new Error("Application not found");
    }
    return { ...application };
  }

  async create(applicationData) {
    await this.delay(450);
    const newApplication = {
      ...applicationData,
      Id: Math.max(...this.applications.map(a => a.Id)) + 1,
      appliedDate: new Date().toISOString()
    };
    this.applications.push(newApplication);
    return { ...newApplication };
  }

  async update(id, applicationData) {
    await this.delay(350);
    const index = this.applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    this.applications[index] = { ...this.applications[index], ...applicationData };
    return { ...this.applications[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.applications.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Application not found");
    }
    this.applications.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ApplicationService();