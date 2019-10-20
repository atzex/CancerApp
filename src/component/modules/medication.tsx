import * as React from 'react';
import bless from 'backendless';
import moment from 'moment';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import CustomStore from 'devextreme/data/custom_store';
import { RefObject } from 'react';

export interface IMedicationPageProps {
  currentDate: number;
}

const store: any = {
  key: 'objectId',
  load: (loadOptions: any) => {
    const today = moment()
      .set('h', 0)
      .set('m', 0)
      .set('s', 0)
      .set('ms', 0);
    const medicationPortionDataQuery = bless.DataQueryBuilder.create()
      .setSortBy('startDate DESC')
      .setWhereClause(
        'startDate >= ' +
          today +
          'and startDate < ' +
          moment(today)
            .add(1, 'd')
            .valueOf()
      );
    return bless.Data.of('medication_portion')
      .find(medicationPortionDataQuery)
      .then(data => {
        return {
          data: data
        };
      })
      .catch(() => {
        throw 'Data Loading Error';
      });
  },
  insert: (values: any) => {
    // ...
  },
  update: (key: string, values: any) => {
    console.log('!!!!!!!!!!!!WERTE!!!', key, JSON.stringify(values));
    return Promise.resolve();
  },
  remove: (key: string) => {
    // ...
  }
};

const activeViews: any = ['day', 'week', 'month'];

export default class MedicationPage extends React.Component<IMedicationPageProps> {
  scheduler: RefObject<Scheduler> = React.createRef();

  state = {
    addNew: false,
    processing: false,
    medication: [],
    medication_portion: [],
    medication_taken: [{ text: 'Not Taken', id: 1, color: '#fc0303' }, { text: 'Taken', id: 2, color: '#03fc07' }]
  };

  loadData = async (date: number) => {
    const medicationDataQuery = bless.DataQueryBuilder.create().setSortBy('text ASC');
    const medication = await bless.Data.of('medication').find(medicationDataQuery);
    this.setState({ medication });
  };

  componentDidMount() {
    const today = moment()
      .set('h', 0)
      .set('m', 0)
      .set('s', 0)
      .set('ms', 0);
    this.loadData(today.valueOf());
  }

  public render() {
    return (
      <React.Fragment>
        <Scheduler ref={this.scheduler} dataSource={store} views={activeViews} defaultCurrentView={'day'} firstDayOfWeek={1} startDayHour={4} showAllDayPanel={false}>
          <Resource dataSource={this.state.medication} fieldExpr={'medicationId'} label={'Drug'} />
          <Resource dataSource={this.state.medication_taken} allowMultiple={false} fieldExpr={'medication_takenId'} label={'Status'} useColorAsDefault={true} />
          <SpeedDialAction icon={'plus'} onClick={this.showAppointmentPopup} />
        </Scheduler>
      </React.Fragment>
    );
  }

  showAppointmentPopup = () => {
    if (this.scheduler.current) {
      this.scheduler.current.instance.showAppointmentPopup();
    }
  };
}
