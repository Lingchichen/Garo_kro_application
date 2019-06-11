import React from 'react';
import { connect } from 'react-redux';
import Button from 'components/Button';
import { openModal, PARKING_LOT } from 'ducks/Modals';
import parkingLotIcon from 'images/ParkingLot-G.png';
import './style.css';

const ParkingLot = props => (
  <div className="box meeting-sidebar parking-lot">
    <div className="header">
      <img src={parkingLotIcon} alt="" /> Parking Lot Issues ({(props
        .parkingLots.length || 'no') + ' issues'})
    </div>
    {props.parkingLots.length > 0 && (
      <ul>
        {props.parkingLots.map(pl => (
          <li key={pl.id}>
            {pl.notes}{' '}
            <span className="time-alloted">- {pl.time_alloted} min</span>
          </li>
        ))}
      </ul>
    )}
    <Button
      click={() => {
        props.openParkingLotModal(props.meeting);
      }}
    >
      New Parking Lot
    </Button>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  parkingLots: state.meetingParkingLots.items.filter(
    ({ meeting }) => meeting === ownProps.meeting
  )
});

const mapDispatchToProps = dispatch => ({
  openParkingLotModal: meeting_id => {
    dispatch(openModal(PARKING_LOT, { meeting_id }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ParkingLot);
