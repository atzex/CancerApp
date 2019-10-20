import * as React from 'react';
import * as Icon from 'react-feather';
import moment from 'moment';

export interface ICommunityPageProps {
  onMount?: () => void;
}

export default class CommunityPage extends React.Component<ICommunityPageProps> {
  state = {
    socialApiData: []
  };

  componentDidMount() {
    this.props.onMount && this.props.onMount();
    this.getData();
  }

  public render() {
    return (
      <div className="community">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {!this.state.socialApiData.length && <Loading />}
              {this.state.socialApiData.length > 0 &&
                this.state.socialApiData.map((item: any) => {
                  if (item.feedItemPlatform === 'facebook_page') {
                    return <FacebookItem key={item.id} item={item} />;
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  async getData() {
    let res = await fetch('https://socialapi.curry-solutions.com/api/1.0/get/fb:339749056362362,fb:494492760743939/');
    if (res) {
      this.setState({ socialApiData: await res.json() });
      // console.log('Res', this.state.socialApiData);
    } else {
      console.error('Error');
    }
  }
}

const openLink = (str: string) => {
  return (e: any) => {
    let win = window.open(str, '_blank');
    if (win) {
      win.focus();
    }
  };
};

const FacebookItem = (props: any) => {
  if (!props) return null;
  let item = props.item;
  return (
    <div className="community__entry community__entry--facebook" onClick={openLink(item.link)}>
      <div className="community__entry-from">{item.from.name}</div>
      <div className="community__entry-icon">
        <Icon.Facebook />
      </div>
      <div className="community__entry-message">{item.message}</div>
      {item.full_picture && <img className="community__entry-image" src={item.full_picture} alt={item.from.name} />}
      <time className="community__entry-date">
        {moment
          .parseZone(item.normalizedDate.date)
          .local()
          .format('MMMM DD YYYY, hh:mm:ss')}
      </time>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="community__loader">
      <svg width="64" height="64" viewBox="0 0 44 44" className="community__loader-svg" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
        <g fill="none" fillRule="evenodd" strokeWidth="2">
          <circle cx="22" cy="22" r="1">
            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" />
            <animate
              attributeName="stroke-opacity"
              begin="-0.9s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
};
