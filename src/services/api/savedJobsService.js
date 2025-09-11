import savedJobsData from "@/services/mockData/savedJobs.json";

class SavedJobsService {
  constructor() {
    this.savedJobs = [...savedJobsData];
  }

  // Get all saved jobs for current user (mock implementation)
  async getAll() {
    await this.delay(300);
    return [...this.savedJobs];
  }

  // Check if a job is saved
  async isSaved(jobId) {
    await this.delay(100);
    return this.savedJobs.some(saved => saved.jobId === jobId);
  }

  // Add a job to saved jobs
  async add(jobId) {
    await this.delay(200);
    
    // Check if already saved
    if (this.savedJobs.some(saved => saved.jobId === jobId)) {
      return false; // Already saved
    }

    const newSavedJob = {
      Id: Math.max(0, ...this.savedJobs.map(s => s.Id)) + 1,
      jobId: jobId,
      savedAt: new Date().toISOString(),
      userId: 1 // Mock user ID
    };

    this.savedJobs.push(newSavedJob);
    return true; // Successfully saved
  }

  // Remove a job from saved jobs
  async remove(jobId) {
    await this.delay(200);
    
    const initialLength = this.savedJobs.length;
    this.savedJobs = this.savedJobs.filter(saved => saved.jobId !== jobId);
    
    return this.savedJobs.length < initialLength; // Return true if removed
  }

  // Toggle saved status
  async toggle(jobId) {
    const isSaved = await this.isSaved(jobId);
    
    if (isSaved) {
      await this.remove(jobId);
      return false; // Now unsaved
    } else {
      await this.add(jobId);
      return true; // Now saved
    }
  }

  // Get saved jobs count
  async getCount() {
    await this.delay(100);
    return this.savedJobs.length;
  }

  // Private helper method
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new SavedJobsService();