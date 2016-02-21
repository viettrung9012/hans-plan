Template.Lewis.rendered = function() {
  TimetableItem = React.createClass ({
      componentDidMount() {
          $(ReactDOM.findDOMNode(this))
            .resizable({
              handles: "e, w",
              stop: this.handleResizeStop,
            })
            .draggable({
              //grid: [this.props.unitWidth, 80],
              revert:true,
              revertDuration: 0,
              stop: this.handleDragStop
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
        var tableWidth= $("#timetable").width() -20;
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
          var tableWidth= $("#timetable").width() -20;
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
      checkNotOverlap(newItem, items) {
        return !(_.some(items, function(item){
            var newEnd = newItem.start + newItem.duration;
          return item.day === newItem.day &&
            ((item.start >= newItem.start && item.start < newEnd) ||
            (item.start + item.duration > newItem.start && item.start + item.duration <= newEnd));
        }));
      },
      renderItems() {
          var tableWidth= $("#timetable").width() - 20;
          var unitWidth= tableWidth / 14;
          var unitHeight= 80;

          return this.state.items.map((item) => {
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
                      onDrag={this.onItemDrag}
                      onResize={this.onItemResize}
                    />;
          });
      },
      getTableGridHorizontal() {
          var tableWidth= $("#timetable").width() -20;
          var unitWidth= tableWidth / 14 -2;
          var grids = [];
          for (var i = 0; i < 7; i++) {
              grids.push(<div className='horizontal-box'></div>);
          }
          return grids;
      },
      getTableGridVertical() {
          var tableWidth= $("#timetable").width() -20;
          console.log(tableWidth);
          var unitWidth= tableWidth / 14 -1;
          var grids = [];
          for (var i = 0; i < 13; i++) {
              grids.push(<div className='vertical-box' style={{width: unitWidth}}></div>);
          }
          return grids;
      },
      getTimeAxis() {
          var tableWidth= $("#timetable").width() -20;
          var unitWidth= Math.floor(tableWidth / 14);
          var unitHeight= 80;
          var time = [];

          for (var i = 0, j=800; i < 14; i++, j+=100) {
              var timeString = (j < 1000 ? "0" : "") + j;
              time.push(<div className="time-axis" style={{width: unitWidth}}>{timeString}</div>);
          }
          return time;
      },
      getDayAxis() {
          var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
          var daysHtml = days.map((day) => <div className="day-text">{day}</div>);
          return daysHtml;
      },
      render() {
          var tableWidth= $("#timetable").width() -20;
          return (<div>
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

  ReactDOM.render(<Timetable/>, document.getElementById("timetable"));
}
