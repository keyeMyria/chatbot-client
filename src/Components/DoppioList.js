import React, {PureComponent} from 'react';
import ListItem from "react-native-elements"

class DoppioListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPressItem(this.props.id);
    };
    
    render() {
        return (
            <ListItem
                {...this.props}
                onPress={this._onPress}
            />
        )
    }
}
  
class DoppioList extends React.PureComponent {
    state = {selected: (new Map(): Map<string, boolean>)};
  
    _keyExtractor = (item, index) => item.id;
  
    _onPressItem = (id: string) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected);
        selected.set(id, !selected.get(id)); // toggle
        return {selected};
      });
    };
  
    _renderItem = ({item}) => (
      <DoppioListItem
        id={item.id}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.id)}
        title={item.title}
      />
    );
  
    render() {
      return (
        <FlatList
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      );
    }
}
  
export { 
    DoppioListItem,
    DoppioList
};
