import React from 'react';
import { connect } from 'react-redux';
import {
  ATTENDANCE,
  PARKING_LOT,
  SUCCESS,
  CHALLENGE,
  UPDATE_STATUS,
  STATUS_HISTORY,
  TEAM_ASSIGNMENT,
  DEVELOPMENT_ACTION_STEP
} from 'ducks/Modals';
import AttendanceModal from './AttendanceModal';
import ParkingLotModal from './ParkingLotModal';
import SuccessModal from './SuccessModal';
import ChallengeModal from './ChallengeModal';
import UpdateStatusModal from './UpdateStatusModal';
import StatusHistoryModal from './StatusHistoryModal';
import TeamAssignmentModal from './TeamAssignmentModal';
import DevelopmentActionStep from './DevelopmentActionStep';
import './style.css';

const Modals = ({ modals }) => {
  return (
    <div className={'modals' + (modals.length ? ' open' : '')}>
      {modals.map((modal, index) => {
        if (modal.modalType === ATTENDANCE)
          return (
            <AttendanceModal key={index} parameters={modal.modalParameters} />
          );
        if (modal.modalType === PARKING_LOT)
          return (
            <ParkingLotModal key={index} parameters={modal.modalParameters} />
          );
        if (modal.modalType === SUCCESS)
          return (
            <SuccessModal key={index} parameters={modal.modalParameters} />
          );
        if (modal.modalType === CHALLENGE)
          return (
            <ChallengeModal key={index} parameters={modal.modalParameters} />
          );
        if (modal.modalType === UPDATE_STATUS)
          return (
            <UpdateStatusModal key={index} parameters={modal.modalParameters} />
          );
        if (modal.modalType === STATUS_HISTORY)
          return (
            <StatusHistoryModal
              key={index}
              parameters={modal.modalParameters}
            />
          );
        if (modal.modalType === TEAM_ASSIGNMENT)
          return (
            <TeamAssignmentModal
              key={index}
              parameters={modal.modalParameters}
            />
          );
        if (modal.modalType === DEVELOPMENT_ACTION_STEP)
          return (
            <DevelopmentActionStep key={index} parameters={modal.modalParameters} />
          );
        return null;
      })}
    </div>
  );
};

const mapStateToProps = state => ({ modals: state.modals });

export default connect(mapStateToProps)(Modals);
