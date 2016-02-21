Template.Lewis.rendered = function() {
  TimetableItem = React.createClass ({
      componentDidMount() {
          $(ReactDOM.findDOMNode(this))
            .draggable({
              //grid: [this.props.unitWidth, 80],
              revert:true,
              revertDuration: 0,
              stop: this.handleDragStop
            })
            .resizable({
              handles: "e, w",
              stop: this.handleResizeStop
            });
      },
      handleDragStop(event, ui) {
          var $node = $(ReactDOM.findDOMNode(this));
          var {top, left} = ui.position;
          //console.log(top + "px, " + left + "px");
          this.props.onDrag(this.props.id, top, left);
      },
      handleResizeStop(event, ui) {
          var $node = $(ReactDOM.findDOMNode(this));
          var {left, top} = ui.position;
          var {width, height} = ui.size;
          this.props.onResize(this.props.id, top, left, width, height);
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
        var tableWidth = $("#timetable").width();
        var unitWidth = tableWidth / 24;
        var unitHeight = 80;
        var items = _.clone(this.state.items, true);

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
            var newItems = _.clone(this.state.items, true);
            newItems = _.map(newItems, function(item){
              if (item.id === newItem.id) {
                item = newItem;
              }
              return item;
            });
            this.setState({items: newItems});
          }
        }
      },
      onItemResize(itemId, top, left, width, height) {
        console.log("Hello Trung");
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
          var tableWidth = $("#timetable").width();
          var unitWidth = tableWidth / 24;
          var unitHeight = 80;

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
      render() {
          return <div>{this.renderItems()}</div>;
      }
  });

  ReactDOM.render(<Timetable/>, document.getElementById("timetable"));
}