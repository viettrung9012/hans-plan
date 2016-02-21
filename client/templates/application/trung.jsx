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
      var width = $("#trung").width() * 0.85;
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
  TimetableItem = React.createClass ({
      componentDidMount() {
          $(ReactDOM.findDOMNode(this))
            .resizable({
              handles: "e, w",
              stop: this.handleResizeStop,
              containment: $(".trung-table")
            })
            .draggable({
              revert:true,
              revertDuration: 0,
              stop: this.handleDragStop,
              containment: $(".trung-table")
            });
      },
      handleDragStop(event, ui) {
          var {top, left} = ui.position;
          this.props.onDrag(this.props.id, top, left);
      },
      handleResizeStop(event, ui) {
          ui.element.css(ui.originalPosition);
          ui.element.css(ui.originalSize);
          var {left, top} = ui.position;
          var {width, height} = ui.size;
          this.props.onResize(this.props.id, left, width);
      },
      render() {
        return <div
                className="item-block"
                key={this.props.id}
                data-id={this.props.id}
                style={{top:this.props.posY + 'px',
                        left:this.props.posX + 'px',
                        width: this.props.width + 'px'}}>
                {this.props.id}
                </div>;
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
      var pos = ui.offset, dPos = $(ReactDOM.findDOMNode(this)).offset();
      var top = pos.top - dPos.top;
      var left = pos.left - dPos.left;
      this.props.handleDrop(ui.draggable.context, top, left);
    },
    handleDrag(itemId, top, left) {
      this.props.handleDrag(itemId, top, left);
    },
    handleResize(itemId, left, width) {
      this.props.handleResize(itemId, left, width);
    },
    renderItems() {
        var width = $("#trung").width() * 0.85;
        if (width < 720) width = 720;
        if (width > 1280) width = 1280;
        var tableWidth= width - 20;
        var unitWidth= tableWidth / 14;
        var unitHeight= 80;

        return this.props.items.map((item) => {
            var itemWidth = unitWidth * item.duration;
            var posX = item.start * unitWidth;
            var posY = item.day * unitHeight;
            return <TimetableItem
                    key={item.id}
                    unitWidth={unitWidth}
                    width={itemWidth}
                    id={item.id}
                    posX={posX}
                    posY={posY}
                    onDrag={this.handleDrag}
                    onResize={this.handleResize}
                  />;
        });
    },
    getTableGridHorizontal() {
        var width = $("#trung").width() * 0.85;
        if (width < 720) width = 720;
        if (width > 1280) width = 1280;
        var tableWidth = width - 20;
        var unitWidth= tableWidth / 14 -2;
        var grids = [];
        for (var i = 0; i < 7; i++) {
            grids.push(<div className='horizontal-box' key={i}></div>);
        }
        return grids;
    },
    getTableGridVertical() {
        var width = $("#trung").width() * 0.85;
        if (width < 720) width = 720;
        if (width > 1280) width = 1280;
        var tableWidth = width - 20;
        var unitWidth= tableWidth / 14 -1;
        var grids = [];
        for (var i = 0; i < 13; i++) {
            grids.push(<div className='vertical-box' key={i} style={{width: unitWidth}}></div>);
        }
        return grids;
    },
    getTimeAxis() {
        var width = $("#trung").width() * 0.85;
        if (width < 720) width = 720;
        if (width > 1280) width = 1280;
        var tableWidth = width - 20;
        var unitWidth= Math.floor(tableWidth / 14);
        var unitHeight= 80;
        var time = [];

        for (var i = 0, j=800; i < 14; i++, j+=100) {
            var timeString = (j < 1000 ? "0" : "") + j;
            time.push(<div className="time-axis" key={timeString} style={{width: unitWidth}}>{timeString}</div>);
        }
        return time;
    },
    getDayAxis() {
        var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        var daysHtml = days.map((day) => <div className="day-text" key={day}>{day}</div>);
        return daysHtml;
    },
    render() {
      var width = $("#trung").width() * 0.85;
      if (width < 720) width = 720;
      if (width > 1280) width = 1280;
      var tableWidth = width - 20;
      return (<div className="trung-table">
            <div className="day-axis">
                <div className="empty-cell"></div>
                {this.getDayAxis()}
            </div>
            <div className="table-right" style={{width: tableWidth}}>
                <div>{this.getTimeAxis()}</div>
                <div id="timetable-item-container">{this.renderItems()}
                    <div id='horizontal-wrapper'>{this.getTableGridHorizontal()}</div>
                    <div id='vertical-wrapper'>{this.getTableGridVertical()}</div>
                </div>
            </div>
        </div>);
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
    onItemDrag(itemId, top, left) {
      var width = $("#trung").width() * 0.85;
      if (width < 720) width = 720;
      if (width > 1280) width = 1280;
      var tableWidth = width - 20;
      var unitWidth= tableWidth / 14;
      var unitHeight= 80;
      var items = JSON.parse(JSON.stringify(this.state.items));
      var newItem;

      items = _.filter(items, function(item){
        if (item.id === itemId) {
          newItem = item;
        }
        return item.id !== itemId;
      });

      if (newItem) {
        newItem.day = Math.round(parseFloat(top)/unitHeight);
        newItem.start = Math.round(parseFloat(left)/unitWidth);

        if (this.checkNotOverlap(newItem, items)) {
          var newItems = _.map(this.state.items, function(item){
            if (item.id === newItem.id) {
              item = newItem;
            }
            return item;
          });
          this.setState({items: newItems});
        }
      }
    },
    onItemResize(itemId, left, width) {
        var viewWidth = $("#trung").width() * 0.85;
        if (viewWidth < 720) viewWidth = 720;
        if (viewWidth > 1280) viewWidth = 1280;
        var tableWidth = viewWidth - 20;
        var unitWidth= tableWidth / 14;
        var unitHeight= 80;
        var items = JSON.parse(JSON.stringify(this.state.items));
        var newItem;

        items = _.filter(items, function(item){
          if (item.id === itemId) {
            newItem = item;
          }
          return item.id !== itemId;
        });
        if (newItem) {
          newItem.start = Math.round(parseFloat(left)/unitWidth);
          newItem.duration = Math.round(parseFloat(width)/unitWidth);
          if (newItem.duration === 0) newItem.duration = 1;
          if (this.checkNotOverlap(newItem, items)) {
              var newItems = _.map(this.state.items, function(item){
                if (item.id === newItem.id) {
                  item = newItem;
                }
                return item;
              });
              this.setState({items: newItems});
          }
        }
    },
    onItemDrop(elem, top, left) {
        var width = $("#trung").width() * 0.85;
        if (width < 720) width = 720;
        if (width > 1280) width = 1280;
        var tableWidth = width - 20;
        var unitWidth= tableWidth / 14;
        var unitHeight= 80;
        var items = JSON.parse(JSON.stringify(this.state.items));
        var newItem = {
          id: ShortId.generate(),
          duration: 1,
          day: Math.round(parseFloat(top)/unitHeight),
          start: Math.round(parseFloat(left)/unitWidth)
        };
        items.push(newItem);
        this.setState({items: items});
    },
    checkNotOverlap(newItem, items) {
      return !(_.some(items, function(item){
          var newEnd = newItem.start + newItem.duration;
        return item.day === newItem.day &&
          ((item.start >= newItem.start && item.start < newEnd) ||
          (item.start + item.duration > newItem.start && item.start + item.duration <= newEnd));
      }));
    },
    render() {
      return (
        <div className="trung">
          <Timetable
            handleDrop={this.onItemDrop}
            handleDrag={this.onItemDrag}
            handleResize={this.onItemResize}
            items={this.state.items}
            />
          <List/>
        </div>
      );
    }
  });
  ReactDOM.render(<Trung/>, document.getElementById("trung"));
};
