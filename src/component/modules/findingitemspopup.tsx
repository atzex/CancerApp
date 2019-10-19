import * as React from 'react';
import { Popup } from 'devextreme-react';
import bless from 'backendless';

export interface IFindingItemsPopupComponentProps {
  onClose?: () => void;
  findingToLoad: string;
}

export default class FindingItemsPopupComponent extends React.Component<IFindingItemsPopupComponentProps> {
  _isMounted = false;
  state = {
    findingfiles: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadData = async () => {
    const dataQuery = bless.DataQueryBuilder.create().setWhereClause("findingref = '" + this.props.findingToLoad + "'");
    const findingfiles = await bless.Data.of('findingfiles').find(dataQuery);
    if (!this._isMounted) return;
    this.setState({ findingfiles });
  };

  public render() {
    return (
      <Popup
        visible={true}
        closeOnOutsideClick={true}
        showCloseButton={true}
        onHidden={() => {
          this.props.onClose && this.props.onClose();
        }}
      >
        <ul>
          {this.state.findingfiles &&
            this.state.findingfiles.map((ff: any) => {
              return <li key={ff.objectId}>{ff.filename}</li>;
            })}
        </ul>
      </Popup>
    );
  }
}
