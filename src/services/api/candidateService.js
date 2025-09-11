import candidatesData from "@/services/mockData/candidates.json";

class CandidateService {
  constructor() {
    this.candidates = [...candidatesData];
  }

  async getAll() {
    await this.delay(350);
    return [...this.candidates];
  }

  async getById(id) {
    await this.delay(250);
    const candidate = this.candidates.find(c => c.Id === parseInt(id));
    if (!candidate) {
      throw new Error("Candidate not found");
    }
    return { ...candidate };
  }

  async create(candidateData) {
    await this.delay(400);
    const newCandidate = {
      ...candidateData,
      Id: Math.max(...this.candidates.map(c => c.Id)) + 1,
      applications: []
    };
    this.candidates.push(newCandidate);
    return { ...newCandidate };
  }

  async update(id, candidateData) {
    await this.delay(300);
    const index = this.candidates.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    this.candidates[index] = { ...this.candidates[index], ...candidateData };
    return { ...this.candidates[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.candidates.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Candidate not found");
    }
    this.candidates.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CandidateService();