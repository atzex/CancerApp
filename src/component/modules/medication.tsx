import * as React from 'react';
import bless from 'backendless';
import moment from 'moment';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import SpeedDialAction from 'devextreme-react/speed-dial-action';
import { RefObject } from 'react';

export interface IMedicationPageProps {
  currentDate: number;
  onMount?: () => void;
}

const store: any = {
  key: 'objectId',
  load: (loadOptions: any) => {
    // console.log('MEDICATION store LOAD loadOptions', JSON.stringify(loadOptions));
    // const currentDay = moment(loadOptions.dxScheduler.startDate)
    //   .set('h', 0)
    //   .set('m', 0)
    //   .set('s', 0)
    //   .set('ms', 0);
    const medicationPortionDataQuery = bless.DataQueryBuilder.create()
      .setPageSize(50)
      .setSortBy('startDate DESC');
    return bless.Data.of('medication_portion')
      .find(medicationPortionDataQuery)
      .then(data => {
        return {
          data: data
        };
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  },
  insert: async (values: any) => {
    // console.log('MEDICATION store INSERT values', values['medication_takenId'] === 2, JSON.stringify(values));
    delete values['objectId'];
    await bless.Data.of('medication_portion').save(values);
    if (values['medication_takenId'] === 2) {
      // console.log('MEDICATION store addDiaryEntry');
      const diaryEntry = {
        entry: values['text'] + ' taken',
        entrydate: moment().valueOf(),
        entrymood: 'smile'
      };
      const retVal = await bless.Data.of('diaryentries').save(diaryEntry);
      // console.log('MEDICATION store addDiaryEntry RET', retVal);
    }
    // console.log('MEDICATION store INSERT retVal', JSON.stringify(retVal));
    // return Promise.resolve();
  },
  update: async (key: string, values: any) => {
    // console.log('MEDICATION store UPDATE key Values', key, JSON.stringify(values));
    await bless.Data.of('medication_portion').save(values);
    if (values['medication_takenId'] === 2) {
      // console.log('MEDICATION store addDiaryEntry');
      const diaryEntry = {
        entry: values['text'] + ' taken',
        entrydate: moment().valueOf(),
        entrymood: 'smile'
      };
      const retVal = await bless.Data.of('diaryentries').save(diaryEntry);
      // console.log('MEDICATION store addDiaryEntry RET', retVal);
    }
    // console.log('MEDICATION store INSERT retVal', JSON.stringify(retValSched));
    // return Promise.resolve();
  },
  remove: async (key: string) => {
    // console.log('MEDICATION store REMOVE key', key);
    await bless.Data.of('medication_portion').remove(key);
    // console.log('MEDICATION store REMOVE retVal', JSON.stringify(retVal));
    // return Promise.resolve();
  }
};

const activeViews: any = ['agenda'];

export default class MedicationPage extends React.Component<IMedicationPageProps> {
  scheduler: RefObject<Scheduler> = React.createRef();

  state = {
    addNew: false,
    processing: false,
    medication: [],
    medication_portion: [],
    medication_taken: [{ text: 'Not Taken', id: 1, color: '#9a75d4' }, { text: 'Taken', id: 2, color: '#46b9a5' }]
  };

  loadData = async (date: number) => {
    const medicationDataQuery = bless.DataQueryBuilder.create().setSortBy('text ASC');
    const medication = await bless.Data.of('medication').find(medicationDataQuery);
    this.setState({ medication });
  };

  componentDidMount() {
    this.props.onMount && this.props.onMount();
    const today = moment()
      .set('h', 0)
      .set('m', 0)
      .set('s', 0)
      .set('ms', 0);
    this.loadData(today.valueOf());
  }

  public render() {
    return (
      <div className="medication">
        <Scheduler
          ref={this.scheduler}
          dataSource={store}
          views={activeViews}
          defaultCurrentView={'agenda'}
          firstDayOfWeek={1}
          startDayHour={4}
          showAllDayPanel={false}
          onAppointmentFormOpening={this.onAppointmentFormOpening}
        >
          <Resource dataSource={this.state.medication} fieldExpr={'medicationId'} label={'Drug'} />
          <Resource dataSource={this.state.medication_taken} allowMultiple={false} fieldExpr={'medication_takenId'} label={'Status'} useColorAsDefault={true} />
          <SpeedDialAction icon={'plus'} onClick={this.showAppointmentPopup} />
        </Scheduler>
      </div>
    );
  }

  showAppointmentPopup = () => {
    if (this.scheduler.current) {
      this.scheduler.current.instance.showAppointmentPopup();
    }
  };

  onAppointmentFormOpening = (data: any) => {
    console.log('MEDICATION updateFormFields');
    const form = data.form;
    const formItems = form.option('items');
    if (formItems[formItems.length - 1] && formItems[formItems.length - 1].dataField !== 'amount') {
      formItems.push({
        dataField: 'amount',
        editorType: 'dxNumberBox',
        label: {
          text: 'Amount'
        }
      });
      form.option('items', formItems);
    }
  };
}
