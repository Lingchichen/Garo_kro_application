import { combineReducers } from "redux";
import apiToken from "./ApiToken";
import alerts from "./Alerts";
import me from "./Me";
import meetings from "./Meetings";
import meetingTypes from "./MeetingTypes";
import attendeeTypes from "./AttendeeTypes";
import departments from "./Departments";
import companies from "./Companies";
import provinces from "./Provinces";
import countries from "./Countries";
import companyCategories from "./CompanyCategories";
import meetingSections from "./MeetingSections";
import meetingTopics from "./MeetingTopics";
import meetingTimer from "./MeetingTimer";
import completedTopics from "./CompletedTopics";
import companyDepartments from "./CompanyDepartments";
import jobCategories from "./JobCategories";
import jobDescriptions from "./JobDescriptions";
import people from "./People";
import defaultCompany from "./DefaultCompany";
import meetingAttendance from "./MeetingAttendance";
import modals from "./Modals";
import meetingProgressNotes from "./MeetingProgressNotes";
import meetingParkingLots from "./MeetingParkingLots";
import growthClasses from "./GrowthClasses";
import teams from "./Teams";
import teamMembers from "./TeamMembers";
import successes from "./Successes";
import challenges from "./Challenges";
import statuses from "./Statuses";
import projects from "./Projects";
import milestones from "./Milestones";
import projectMilestoneDevelopmentStepStatuses from "./ProjectMilestoneDevelopmentStepStatuses";
import values from "./Values";
import strengthAssessmentRequests from "./StrengthAssessmentRequests";
import assessmentRequestPeople from "./AssessmentRequestPeople";
import strengthAssessments from "./StrengthAssessments";
import strengthAssessmentValues from "./StrengthAssessmentValues";
import strengthAssessmentReviews from "./StrengthAssessmentReviews";
import performanceReviews from	"./PerformanceReviews";
import employeeDevelopmentPlanReviews from "./EmployeeDevelopmentPlanReviews";
import employeeDevelopmentPlanActionSteps from "./EmployeeDevelopmentPlanActionSteps";
import reviewInProgress from "./DevelopmentReviewInProgress";
/* Compose the individual reducers into one master reducer, which the store will
use to handle all updates. */
export default combineReducers({
  apiToken,
  me,
  alerts,
  meetings,
  meetingTypes,
  attendeeTypes,
  departments,
  companies,
  provinces,
  countries,
  companyCategories,
  meetingSections,
  meetingTopics,
  meetingTimer,
  completedTopics,
  companyDepartments,
  jobCategories,
  jobDescriptions,
  people,
  defaultCompany,
  meetingAttendance,
  modals,
  meetingProgressNotes,
  meetingParkingLots,
  growthClasses,
  teams,
  teamMembers,
  successes,
  challenges,
  statuses,
  projects,
  milestones,
  projectMilestoneDevelopmentStepStatuses,
  values,
  strengthAssessmentRequests,
  assessmentRequestPeople,
  strengthAssessments,
  strengthAssessmentValues,
  strengthAssessmentReviews,
  performanceReviews,
  employeeDevelopmentPlanReviews,
  employeeDevelopmentPlanActionSteps,
  reviewInProgress
});
