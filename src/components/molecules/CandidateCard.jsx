import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const CandidateCard = ({ candidate, onView, onMessage, onInvite }) => {
  const experienceYears = candidate.experience.reduce((total, exp) => {
    const years = exp.duration || 1;
    return total + years;
  }, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {candidate.name.split(" ").map(n => n[0]).join("").toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidate.name}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {candidate.location}
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <ApperIcon name="Briefcase" className="w-4 h-4 mr-1" />
            {experienceYears} years experience
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 6).map((skill, index) => (
            <Badge key={index} variant="default">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 6 && (
            <Badge variant="default">
              +{candidate.skills.length - 6} more
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Experience</h4>
        {candidate.experience[0] && (
          <div className="text-sm text-gray-600">
            <p className="font-medium">{candidate.experience[0].position}</p>
            <p>{candidate.experience[0].company}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="small" onClick={() => onView(candidate)}>
          View Profile
        </Button>
        <Button variant="secondary" size="small" onClick={() => onMessage(candidate)}>
          <ApperIcon name="MessageSquare" className="w-4 h-4 mr-1" />
          Message
        </Button>
        <Button size="small" onClick={() => onInvite(candidate)}>
          Invite to Apply
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;