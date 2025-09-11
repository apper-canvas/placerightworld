import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import { useRole } from "@/hooks/useRole";
import candidateService from "@/services/api/candidateService";
import companyService from "@/services/api/companyService";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentRole } = useRole();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const loadProfile = async () => {
    try {
      setError("");
      setLoading(true);
      
      if (currentRole === "candidate") {
        const data = await candidateService.getById(1); // Mock candidate ID
        setProfile(data);
        setFormData(data);
      } else {
        const data = await companyService.getById(1); // Mock company ID
        setProfile(data);
        setFormData(data);
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [currentRole]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key, index, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].map((item, i) => i === index ? value : item)
    }));
  };

  const handleAddArrayItem = (key, newItem) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newItem]
    }));
  };

  const handleRemoveArrayItem = (key, index) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      if (currentRole === "candidate") {
        await candidateService.update(1, formData);
      } else {
        await companyService.update(1, formData);
      }
      
      setProfile(formData);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadProfile} />;
  if (!profile) return <Error title="Profile not found" message="Unable to load profile data" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentRole === "candidate" ? "Candidate Profile" : "Company Profile"}
          </h1>
          <p className="text-gray-600">
            Manage your {currentRole === "candidate" ? "personal information and career details" : "company information and job postings"}
          </p>
        </div>

        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                {currentRole === "candidate" 
                  ? profile.name?.split(" ").map(n => n[0]).join("").toUpperCase()
                  : profile.name?.charAt(0)?.toUpperCase()
                }
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.name}
              </h2>
              <p className="text-gray-600">
                {currentRole === "candidate" ? profile.location : profile.industry}
              </p>
            </div>

            {currentRole === "candidate" && (
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  {profile.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                  {profile.location}
                </div>
              </div>
            )}

            {currentRole === "recruiter" && (
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                  {profile.industry}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                  {profile.size}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Globe" className="w-4 h-4 mr-2" />
                  {profile.website}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>

            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                {currentRole === "candidate" ? (
                  <>
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    <Input
                      label="Phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                    <Input
                      label="Location"
                      value={formData.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Industry"
                      value={formData.industry || ""}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                    />
                    <Input
                      label="Company Size"
                      value={formData.size || ""}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                    />
                    <Input
                      label="Website"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white"
                    placeholder={currentRole === "candidate" ? "Tell us about yourself..." : "Describe your company..."}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">{profile.name}</p>
                  </div>
                  {currentRole === "candidate" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{profile.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-gray-900">{profile.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="mt-1 text-gray-900">{profile.location}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                        <p className="mt-1 text-gray-900">{profile.industry}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Size</label>
                        <p className="mt-1 text-gray-900">{profile.size}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <p className="mt-1 text-gray-900">{profile.website}</p>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{profile.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills/Services */}
          {currentRole === "candidate" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                {editing && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleAddArrayItem("skills", "")}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                )}
              </div>

              {editing ? (
                <div className="space-y-2">
                  {(formData.skills || []).map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                        placeholder="Enter skill"
                      />
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleRemoveArrayItem("skills", index)}
                      >
                        <ApperIcon name="X" className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(profile.skills || []).map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Experience/Jobs */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentRole === "candidate" ? "Experience" : "Recent Job Postings"}
              </h3>
            </div>

            {currentRole === "candidate" ? (
              <div className="space-y-4">
                {(profile.experience || []).map((exp, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-gray-900">{exp.position}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-600">{exp.duration || "1 year"}</p>
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(profile.jobs || []).slice(0, 3).map((job, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{job}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="success">Active</Badge>
                      <span className="text-sm text-gray-500">2 applications</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;