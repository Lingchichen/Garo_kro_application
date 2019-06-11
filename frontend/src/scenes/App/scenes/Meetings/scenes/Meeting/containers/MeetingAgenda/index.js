import React, { Component } from "react";
import { connect } from "react-redux";
import { completeTopic } from "ducks/CompletedTopics";
import { saveMeetingProgressNotes } from "ducks/MeetingProgressNotes";
import Button from "components/Button";
import meetingAgendaIcon from "images/MeetingAgenda.png";
import check from "images/checkmark.png";
import "./style.css";

class MeetingAgenda extends Component {
  constructor(props) {
    super(props);
    this.MEETING_NOTES = "MEETING_NOTES";
    this.POST_MEETING_NOTES = "POST_MEETING_NOTES";

    this.sections = this.sections.bind(this);
    this.topics = this.topics.bind(this);
    this.sectionCheckbox = this.sectionCheckbox.bind(this);
    this.meetingNotesSelected = this.meetingNotesSelected.bind(this);
    this.postMeetingNotesSelected = this.postMeetingNotesSelected.bind(this);
    this.presenterChanged = this.presenterChanged.bind(this);
    this.notesChanged = this.notesChanged.bind(this);
    this.completeTopic = this.completeTopic.bind(this);
    this.selectTopic = this.selectTopic.bind(this);

    this.state = { notes: [] };
    this.state = this.createStateFromProps(props);
  }

  createStateFromProps(props) {
    return {
      notes: props.topics.map(topic => ({
        topic: topic.id,
        type: (() => {
          let note = this.state.notes.find(n => n.topic === topic.id);
          if (note) return note.type;
          return this.MEETING_NOTES;
        })(),
        id: (() => {
          let note = this.props.notes.find(note => note.topic === topic.id);
          if (note) return note.id;
          if (topic.id < 0) {
            note = this.props.notes.find(n => n.section === topic.section);
            if (note) return note.id;
          }
          return null;
        })(),
        presenter: (() => {
          let note = this.props.notes.find(note => note.topic === topic.id);
          if (note) return note.presenter;
          if (topic.id < 0) {
            note = this.props.notes.find(n => n.section === topic.section);
            if (note) return note.presenter;
          }
          if (this.props.attendees.length) return this.props.attendees[0].id;
          return null;
        })(),
        notes: (() => {
          let note = this.props.notes.find(note => note.topic === topic.id);
          if (note) return note.meeting_notes;
          if (topic.id < 0) {
            note = this.props.notes.find(n => n.section === topic.section);
            if (note) return note.meeting_notes;
          }
          return "";
        })(),
        postMeetingNotes: (() => {
          let note = this.props.notes.find(note => note.topic === topic.id);
          if (note) return note.post_meeting_notes;
          if (topic.id < 0) {
            note = this.props.notes.find(n => n.section === topic.section);
            if (note) return note.post_meeting_notes;
          }
          return "";
        })()
      })),
      currentTopic: this.props.sections.length
        ? this.sectionTopics(
            this.props.sections.sort((a, b) => a.order - b.order)[0].id
          ).sort((a, b) => a.order - b.order)[0].id
        : 0
    };
  }

  topicCompleted(topic_id) {
    return this.props.completedTopics.find(ct => ct === topic_id)
      ? true
      : false;
  }

  sectionCompleted(section_id) {
    return this.sectionTopics(section_id).reduce(
      (acc, topic) => acc && this.topicCompleted(topic.id),
      true
    );
  }

  sectionTopics(section_id) {
    return this.props.topics.filter(topic => topic.section === section_id);
  }

  completeTopic(topic_id) {
    this.props.completeTopic(topic_id);
    let sortedSections = this.props.sections.sort((a, b) => a.order - b.order);
    let nextSection = sortedSections.find(x => !this.sectionCompleted(x.id));
    let topics = this.sectionTopics(nextSection.id);
    let sortedTopics = topics.sort((a, b) => a.order - b.order);
    let nextTopic = sortedTopics.find(
      x => !this.topicCompleted(x.id) && x.id !== topic_id
    );
    if (!nextTopic) {
      nextSection = sortedSections.find(
        x => !this.sectionCompleted(x.id) && x.id !== nextSection.id
      );
      if (!nextSection) {
        this.setState({ currentTopic: 0 });
        return;
      }
      topics = this.sectionTopics(nextSection.id);
      sortedTopics = topics.sort((a, b) => a.order - b.order);
      nextTopic = sortedTopics.find(
        x => !this.topicCompleted(x.id) && x.id !== topic_id
      );
    }
    this.setState({ currentTopic: nextTopic.id });
  }

  topicCheckbox(topic_id, currentTopic) {
    let completed = this.props.completedTopics.find(ct => ct === topic_id)
      ? true
      : false;
    return (
      <img
        className="topic-checkbox"
        src={completed ? check : ""}
        alt=""
        onClick={
          completed
            ? () => {}
            : () => {
                this.completeTopic(topic_id);
              }
        }
      />
    );
  }

  sectionCheckbox(section_id) {
    let completed = this.sectionCompleted(section_id);
    return (
      <img className="section-checkbox" src={completed ? check : ""} alt="" />
    );
  }

  selectTopic(topic_id) {
    return () => {
      if (topic_id === this.state.currentTopic)
        this.setState({ currentTopic: 0 });
      this.setState({ currentTopic: topic_id });
    };
  }

  topics(section_id) {
    return this.sectionTopics(section_id)
      .sort((a, b) => a.order - b.order)
      .map(topic => {
        let currentTopic =
          this.props.active && this.state.currentTopic === topic.id;
        return (
          <li key={topic.id} className="topic">
            <div className={"notes" + (currentTopic ? " active" : "")}>
              <div className="topic-title">
                {this.props.active &&
                  this.topicCheckbox(topic.id, currentTopic)}{" "}
                <span
                  onClick={this.selectTopic(topic.id)}
                  style={{ cursor: "pointer" }}
                >
                  {topic.display_name}
                </span>
              </div>
              {currentTopic && (
                <div>
                  <div className="buttons">
                    <Button
                      className={
                        "notes-button" +
                        (this.state.notes.find(n => n.topic === topic.id)
                          .type === this.MEETING_NOTES
                          ? " active"
                          : "")
                      }
                      click={this.meetingNotesSelected(topic.id)}
                    >
                      Meeting Notes
                    </Button>
                    <Button
                      className={
                        "post-notes-button" +
                        (this.state.notes.find(n => n.topic === topic.id)
                          .type === this.POST_MEETING_NOTES
                          ? " active"
                          : "")
                      }
                      click={this.postMeetingNotesSelected(topic.id)}
                    >
                      Post-Meeting Notes
                    </Button>
                  </div>
                  <div className="presenter">
                    Presenter{" "}
                    <select
                      value={
                        this.state.notes.find(n => n.topic === topic.id)
                          .presenter
                      }
                      onChange={this.presenterChanged(topic.id)}
                    >
                      {this.props.attendees
                        .sort((a, b) => {
                          if (a.user.last_name < b.user.last_name) return -1;
                          if (a.user.last_name > b.user.last_name) return 1;
                          return 0;
                        })
                        .map(att => (
                          <option key={att.id} value={att.id}>
                            {att.user.first_name + " " + att.user.last_name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="notes-field">
                    <textarea
                      value={(() => {
                        let notes = this.state.notes.find(
                          n => n.topic === topic.id
                        );
                        if (notes.type === this.MEETING_NOTES)
                          return notes.notes;
                        return notes.postMeetingNotes;
                      })()}
                      onChange={this.notesChanged(topic.id)}
                      onBlur={this.saveNotes(topic.id)}
                    />
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      });
  }

  sections() {
    return this.props.sections
      .sort((a, b) => a.order - b.order)
      .map(section => {
        return (
          <li key={section.id} className="section">
            {this.props.active && this.sectionCheckbox(section.id)}{" "}
            {section.display_name} -{" "}
            <span className="duration">{section.estimated_duration} min</span>
            <ul>{this.topics(section.id)}</ul>
          </li>
        );
      });
  }

  meetingNotesSelected(topic_id) {
    return () => {
      let newNotes = this.state.notes.map(n => {
        if (n.topic === topic_id)
          return Object.assign({}, n, { type: this.MEETING_NOTES });
        return n;
      });
      this.setState({ notes: newNotes });
    };
  }

  postMeetingNotesSelected(topic_id) {
    return () => {
      let newNotes = this.state.notes.map(n => {
        if (n.topic === topic_id)
          return Object.assign({}, n, { type: this.POST_MEETING_NOTES });
        return n;
      });
      this.setState({ notes: newNotes });
    };
  }

  presenterChanged(topic_id) {
    let saveNotes = this.saveNotes(topic_id);
    return e => {
      let newPresenter = parseInt(e.target.value, 10);
      let newNotes = this.state.notes.map(n => {
        if (n.topic === topic_id)
          return Object.assign({}, n, { presenter: newPresenter });
        return n;
      });
      this.setState({ notes: newNotes }, () => {
        saveNotes();
      });
    };
  }

  notesChanged(topic_id) {
    return e => {
      let newNotesValue = e.target.value;
      let newNotes = this.state.notes.map(n => {
        if (n.topic === topic_id)
          if (n.type === this.MEETING_NOTES)
            return Object.assign({}, n, { notes: newNotesValue });
          else return Object.assign({}, n, { postMeetingNotes: newNotesValue });

        return n;
      });
      this.setState({ notes: newNotes });
    };
  }

  saveNotes(topic_id) {
    return () => {
      let presenter = this.state.notes.find(n => n.topic === topic_id)
        .presenter;
      if (presenter) {
        let id = this.state.notes.find(n => n.topic === topic_id).id;
        let newNotes = {
          meeting: this.props.meeting.id,
          presenter: presenter,
          meeting_notes: this.state.notes.find(n => n.topic === topic_id).notes,
          post_meeting_notes: this.state.notes.find(n => n.topic === topic_id)
            .postMeetingNotes
        };
        if (id && id > 0) newNotes.id = id;
        if (topic_id && topic_id > 0) newNotes.topic = topic_id;
        else
          newNotes.section = this.props.topics.find(
            t => t.id === topic_id
          ).section;
        this.props.saveMeetingProgressNotes(this.props.apiToken, newNotes);
      }
    };
  }

  render() {
    return (
      <div
        className="box meeting-agenda"
        style={{ width: "49%", float: "left" }}
      >
        <div className="header">
          <img src={meetingAgendaIcon} alt="" /> Meeting Agenda
        </div>
        <ul>{this.sections()}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let otherTopicId = -1;
  let topics = ownProps.topics.concat(
    ownProps.sections.map(section => ({
      id: otherTopicId--,
      section: section.id,
      title: "OTHER",
      display_name: "Other",
      review_financials: false,
      review_success_challege: false,
      review_project: false,
      order: 1000
    }))
  );

  return {
    topics,
    completedTopics: state.completedTopics,

    attendees: state.meetingAttendance.items
      .filter(({ meeting }) => meeting === ownProps.meeting.id)
      .map(({ person }) => state.people.items.find(({ id }) => id === person)),

    notes: state.meetingProgressNotes.items.filter(
      ({ meeting }) => meeting === ownProps.meeting.id
    ),
    apiToken: state.apiToken.value
  };
};

const mapDispatchToProps = dispatch => ({
  completeTopic: topic_id => {
    dispatch(completeTopic(topic_id));
  },
  saveMeetingProgressNotes: (token, notes) => {
    dispatch(saveMeetingProgressNotes(token, notes));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingAgenda);
