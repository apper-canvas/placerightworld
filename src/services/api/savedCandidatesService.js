import savedCandidatesData from "@/services/mockData/savedCandidates.json";

class SavedCandidatesService {
  constructor() {
    // Mock current user ID - in real app this would come from auth context
    this.currentUserId = 1;
    this.savedCandidates = [...savedCandidatesData];
  }

  // Simulate network delay
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    
    // Filter by current user (recruiter)
    return this.savedCandidates
      .filter(item => item.userId === this.currentUserId)
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)); // Most recent first
  }

  async add(candidateId) {
    await this.delay();
    
    // Check if already saved
    const existing = this.savedCandidates.find(
      item => item.candidateId === candidateId && item.userId === this.currentUserId
    );
    
    if (existing) {
      throw new Error("Candidate is already saved");
    }

    const newSavedCandidate = {
      Id: Math.max(...this.savedCandidates.map(s => s.Id), 0) + 1,
      candidateId,
      userId: this.currentUserId,
      savedAt: new Date().toISOString()
    };

    this.savedCandidates.push(newSavedCandidate);
    return newSavedCandidate;
  }

  async remove(candidateId) {
    await this.delay();
    
    const index = this.savedCandidates.findIndex(
      item => item.candidateId === candidateId && item.userId === this.currentUserId
    );
    
    if (index === -1) {
      throw new Error("Saved candidate not found");
    }

    this.savedCandidates.splice(index, 1);
    return true;
  }

  async checkSaved(candidateId) {
    await this.delay(100); // Shorter delay for status checks
    
    return this.savedCandidates.some(
      item => item.candidateId === candidateId && item.userId === this.currentUserId
    );
  }

  // Get saved candidate by candidate ID
  async getByCandidateId(candidateId) {
    await this.delay();
    
    return this.savedCandidates.find(
      item => item.candidateId === candidateId && item.userId === this.currentUserId
    );
  }

  // Get count of saved candidates for current user
  async getCount() {
    await this.delay(100);
    
    return this.savedCandidates.filter(
      item => item.userId === this.currentUserId
    ).length;
  }
}

export default new SavedCandidatesService();