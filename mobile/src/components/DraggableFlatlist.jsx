import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { TouchableOpacity } from 'react-native';
import RNDraggableFlatlist, {
  OpacityDecorator,
  ScaleDecorator,
  ShadowDecorator,
  useOnCellActiveAnimation
} from 'react-native-draggable-flatlist';
import { Center, Text } from 'native-base';

const renderItem = ({ item, drag }) => {
  const itemWidth = Dimensions.get("window").width - 64;
  const { isActive } = useOnCellActiveAnimation();

  return (
    <ScaleDecorator>
      <OpacityDecorator activeOpacity={0.5}>
        <ShadowDecorator>
          <TouchableOpacity
            onLongPress={drag}
            activeOpacity={1}
            style={{
              alignItems: "center",
              justifyContent: "center",
              elevation: isActive ? 30 : 0
            }}
          >
            <Animated.View style={{ marginVertical: 6 }}>
              <Center bg="green.400" rounded="md" w={itemWidth} py={3}>
                <Text color="purple.800" textTransform="uppercase" fontFamily="Montserrat_600SemiBold">{item}</Text>
              </Center>
            </Animated.View>
          </TouchableOpacity>
        </ShadowDecorator>
      </OpacityDecorator>
    </ScaleDecorator>
  );
};

export function DraggableFlatlist({ data, ...rest }) {
  return (
    <RNDraggableFlatlist
      data={data}
      keyExtractor={(item) => item}
      renderItem={renderItem}
      {...rest}
    />
  );
};