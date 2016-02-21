Template.Trung.rendered = function() {
  SearchBar = React.createClass({
    render() {
      return (
      <form>
        <input
          type="text"
          placeholder="Search..."
        />
      </form>
    );
    }
  });
  ListItem = React.createClass({
    componentDidMount() {
        $(ReactDOM.findDOMNode(this))
          .draggable({
            helper: 'clone'
          });
    },
    render() {
      var width = $("#trung").width() * 0.8;
      if (width < 720) width = 720;
      if (width > 1280) width = 1280;
      width /= 14;
      return <div
              className="list-item"
              key={this.props.id}
              data-id={this.props.id}
              style={{width: width + 'px',
                      height: '80px'}}>
              {this.props.id}
            </div>;
    }
  });
  List = React.createClass({
    renderItems() {
        var listData = [
          {
            id: 'fish-1',
            duration: 1
          },
          {
            id: 'fish-2',
            duration: 2
          },
          {
            id: 'fish-3',
            duration: 3
          }
        ]
        return listData.map((item) => {
            return  <ListItem
                      key={item.id}
                      id={item.id}
                    />;
        });
    },
    render() {
      return (
        <div className="trung-list">
          <SearchBar/>
          {this.renderItems()}
        </div>
      )
    }
  });
  Timetable = React.createClass({
    componentDidMount() {
        $(ReactDOM.findDOMNode(this))
          .droppable({
            accept: '.list-item',
            drop: this.handleDrop
          });
    },
    handleDrop: function(event, ui) {
      console.log(event);
      console.log(ui);
      var pos = ui.offset, dPos = $(ReactDOM.findDOMNode(this)).offset();
      console.log({
        top: (pos.top - dPos.top),
        left: (pos.left - dPos.left)
      });
    },
    render() {
      return (
        <div
          className="trung-table">
          "This is a timetable"
        </div>
      )
    }
  });
  Trung = React.createClass({
    getInitialState() {
      return {
        items: [{
            id: 'item-1',
            duration: 1,
            day: 0,
            start: 0
        }, {
            id: 'item-2',
            duration: 2,
            day: 1,
            start: 1
        }]
      };
    },
    render() {
      return (
        <div className="trung">
          <Timetable/>
          <List/>
        </div>
      );
    }
  });
  ReactDOM.render(<Trung/>, document.getElementById("trung"));
};
