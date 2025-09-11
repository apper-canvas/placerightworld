import companiesData from "@/services/mockData/companies.json";

class CompanyService {
  constructor() {
    this.companies = [...companiesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.companies];
  }

  async getById(id) {
    await this.delay(200);
    const company = this.companies.find(c => c.Id === parseInt(id));
    if (!company) {
      throw new Error("Company not found");
    }
    return { ...company };
  }

  async create(companyData) {
    await this.delay(400);
    const newCompany = {
      ...companyData,
      Id: Math.max(...this.companies.map(c => c.Id)) + 1,
      jobs: []
    };
    this.companies.push(newCompany);
    return { ...newCompany };
  }

  async update(id, companyData) {
    await this.delay(350);
    const index = this.companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    this.companies[index] = { ...this.companies[index], ...companyData };
    return { ...this.companies[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.companies.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Company not found");
    }
    this.companies.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CompanyService();