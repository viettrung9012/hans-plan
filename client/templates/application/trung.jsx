Template.Trung.rendered = function() {
  var width = $("#trung").width() * 0.85;
  if (width < 720) width = 720;
  if (width > 1640) width = 1640;
  var tableWidth = width - 20;
  var unitWidth = tableWidth / 14;
  var unitHeight = 80;

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
          height: '390',
          width: '640'
      });
  }

  $("#player")
    .dialog({
              autoOpen: false
            });



  SearchBar = React.createClass({
    handleSearch: function(e) {
      e.preventDefault();
      this.props.onUserInput(
        this.refs.searchTextInput.value
      );
      $(e.target).find('input').val('');
    },
    render() {
      return (
      <form onSubmit={this.handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          ref="searchTextInput"
        />
      </form>
    );
    }
  });
  ListItem = React.createClass({
    componentDidMount() {
        $(ReactDOM.findDOMNode(this))
          .click(function(){
            $("#player").dialog("open");
            player.loadPlaylist("PLEpfh9jiEpYQJWMW2EF2PgCBhz2SQu6Ld");
          })
          .draggable({
            helper: 'clone',
            start: function (e, ui) {
                ui.helper.animate({
                    width: unitWidth,
                    height: 80
                });
            },
            cursorAt: {left: unitWidth/2, top: 40}
          });
    },
    render() {
      return <div
              className="list-item"
              key={this.props.key}
              data-playlistid={this.props.id}
              >
              <img className="list-item-image" src={this.props.thumbnail}/>
              <span>{this.props.title}</span>
            </div>;
    }
  });
  List = React.createClass({
    getInitialState() {
      return {
          items: []
        };
    },
    onUserInput(searchText) {
      var self = this;
      serverCall('searchPlaylist', searchText)
      .then(function(response){
        var items = _.map(response, function(item){
          return {
            playlistId: item.id.playlistId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url
          }
        });
        self.setState({items: items});
      })
      .catch(function(error){
        console.log(error)
      });
    },
    renderItems() {
        return this.state.items.map((item) => {
            return  <ListItem
                      key={item.playlistId}
                      id={item.playlistId}
                      title={item.title}
                      thumbnail={item.thumbnail}
                    />;
        });
    },
    render() {
      return (
        <div className="trung-list">
          <SearchBar
              onUserInput={this.onUserInput}
            />
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
                {this.props.title}
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
        return this.props.items.map((item) => {
            var itemWidth = unitWidth * item.duration;
            var posX = item.start * unitWidth;
            var posY = item.day * unitHeight;
            return <TimetableItem
                    key={item.id}
                    unitWidth={unitWidth}
                    width={itemWidth}
                    id={item.id}
                    title={item.title}
                    posX={posX}
                    posY={posY}
                    onDrag={this.handleDrag}
                    onResize={this.handleResize}
                  />;
        });
    },
    getTableGridHorizontal() {
        var grids = [];
        for (var i = 0; i < 7; i++) {
            grids.push(<div className='horizontal-box' key={i}></div>);
        }
        return grids;
    },
    getTableGridVertical() {
        var unitWidthV= tableWidth / 14 -1;
        var grids = [];
        for (var i = 0; i < 13; i++) {
            grids.push(<div className='vertical-box' key={i} style={{width: unitWidthV}}></div>);
        }
        return grids;
    },
    getTimeAxis() {
        var unitWidthT = Math.floor(tableWidth / 14);
        var time = [];

        for (var i = 0, j=800; i < 14; i++, j+=100) {
            var timeString = (j < 1000 ? "0" : "") + j;
            time.push(<div className="time-axis" key={timeString} style={{width: unitWidthT}}>{timeString}</div>);
        }
        return time;
    },
    getDayAxis() {
        var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        var daysHtml = days.map((day) => <div className="day-text" key={day}>{day}</div>);
        return daysHtml;
    },
    render() {
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
    mixins: [ReactMeteorData],
    getMeteorData() {
        if (Timetables.find({owner: Cookie.get('userId')}).count() === 0) {
            Timetables.insert({
                owner: userId,
                items: []
            });
        }
        return Timetables.findOne({owner: Cookie.get('userId')});
    },
    /*
    componentDidMount() {
        var reminder = setInterval(function() {
            var currentHour = new Date().getHours();
            var currentMinute = new Date().getMinutes();
            var currentDay = new Date().getDay() - 1;
            currentDay = currentDay < 0 ? 6 : currentDay;

            //if (currentMinute === 0) {
                var hasSome = this.state.items.some(function(item) {
                    return item.day === currentDay && item.hour === currentHour;
                });
                if (hasSome) {
                    $("#player").dialog("open");
                }
            //}
        }, 5000);
    },
    */
    onItemDrag(itemId, top, left) {
      var items = JSON.parse(JSON.stringify(this.data.items));
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
          var newItems = _.map(this.data.items, function(item){
            if (item.id === newItem.id) {
              item = newItem;
            }
            return item;
          });
          Timetables.update(this.data._id, {$set:{items: newItems}});
        }
      }
    },
    onItemResize(itemId, left, width) {
        var items = JSON.parse(JSON.stringify(this.data.items));
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
              var newItems = _.map(this.data.items, function(item){
                if (item.id === newItem.id) {
                  item = newItem;
                }
                return item;
              });
              Timetables.update(this.data._id, {$set:{items: newItems}});
          }
        }
    },
    onItemDrop(elem, top, left) {
        var items = JSON.parse(JSON.stringify(this.data.items));
        var newItem = {
          id: ShortId.generate(),
          duration: 1,
          day: Math.round(parseFloat(top)/unitHeight),
          start: Math.round(parseFloat(left)/unitWidth),
          title: $(elem).find('span').text(),
          playlistId: $(elem).data('playlistid')
        };
        if (this.checkNotOverlap(newItem, items)) {
          items.push(newItem);
          Timetables.update(this.data._id, {$set:{items: items}});
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
    render() {
      return (
        <div className="trung">
          <Timetable
            handleDrop={this.onItemDrop}
            handleDrag={this.onItemDrag}
            handleResize={this.onItemResize}
            items={this.data.items}
            />
          <List/>
        </div>
      );
    }
  });
  ReactDOM.render(<Trung/>, document.getElementById("trung"));
};
