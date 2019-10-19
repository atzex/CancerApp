import * as React from 'react';
import bless from 'backendless';

export interface IDiaryPageProps {
  currentDate: number;
}

export default class DiaryPage extends React.Component<IDiaryPageProps> {
  state = {
    entries: []
  };

  loadData = async (date: number) => {
    const dataQuery = bless.DataQueryBuilder.create()
      .setSortBy('entrydate DESC')
      .setWhereClause('entrydate >= ' + date + 'and entrydate');
    const entries = await bless.Data.of('diaryentries').find(dataQuery);
    this.setState({ entries });
  };

  componentDidMount() {
    // this.loadData();
  }

  componentWillReceiveProps(nextProps: IDiaryPageProps) {
    if (this.props.currentDate !== nextProps.currentDate) {
      // this.setState({ currentDate: nextProps.currentDate });
      this.loadData(nextProps.currentDate);
    }
  }

  public render() {
    return (
      <ul>
        {this.state.entries.map((value: any) => {
          return (
            <li key={value.objectId}>
              {value.entrydate} - {value.entry}
            </li>
          );
        })}
      </ul>
    );
  }
}
