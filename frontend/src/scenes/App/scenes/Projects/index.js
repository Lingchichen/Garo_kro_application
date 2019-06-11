import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectsList from './containers/ProjectsList';
import Project from './scenes/Project';
import Milestones from './scenes/Project/scenes/Milestones';

const NewMeetingProject = props => <Project {...props} project={null} />;

const Projects = () => (
  <div className="projects">
    <Switch>
      <Route
        path={`/projects/new/meeting/:meetingId`}
        component={NewMeetingProject}
      />
      <Route path={`/projects/:projectId/milestones`} component={Milestones} />
      <Route path={`/projects/:projectId`} component={Project} />
      <Route path={`/projects`} component={ProjectsList} />
    </Switch>
  </div>
);

export default Projects;
