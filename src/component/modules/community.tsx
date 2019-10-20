import * as React from 'react';

export interface ICommunityPageProps {
  onMount?: () => void;
}

export default class CommunityPage extends React.Component<ICommunityPageProps> {
  componentDidMount() {
    this.props.onMount && this.props.onMount();
  }
  public render() {
    return <div>Community</div>;
  }
}
