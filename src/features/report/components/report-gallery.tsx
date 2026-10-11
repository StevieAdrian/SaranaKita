import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import leftArrow from '@/assets/images/left-arrow.png';

export type ReportGalleryProps = {
  imageUrls: readonly string[];
  title: string;
};

const HEIGHT = 240;
const RIGHT_ARROW = { transform: [{ rotate: '180deg' }] } as const;

export function ReportGallery({
  imageUrls,
  title,
}: ReportGalleryProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<string>>(null);
  const [index, setIndex] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <View
        className="bg-gray-200"
        style={{ height: HEIGHT }}
        accessibilityLabel="Tidak ada foto laporan"
      />
    );
  }

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(imageUrls.length - 1, next));
    listRef.current?.scrollToIndex({ index: clamped, animated: true });
    setIndex(clamped);
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const hasMany = imageUrls.length > 1;

  return (
    <View style={{ height: HEIGHT }}>
      <FlatList
        ref={listRef}
        data={imageUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(uri, i) => `${i}-${uri}`}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        renderItem={({ item, index: i }) => (
          <Image
            source={{ uri: item }}
            resizeMode="cover"
            style={{ width, height: HEIGHT }}
            className="bg-gray-200"
            accessibilityLabel={`Foto ${i + 1} dari ${
              imageUrls.length
            }: ${title}`}
          />
        )}
      />
      {hasMany && index > 0 ? (
        <Pressable
          onPress={() => goTo(index - 1)}
          accessibilityRole="button"
          accessibilityLabel="Foto sebelumnya"
          className="absolute left-2 top-0 h-full w-11 justify-center active:opacity-60"
        >
          <Image source={leftArrow} resizeMode="contain" className="h-6 w-6" />
        </Pressable>
      ) : null}
      {hasMany && index < imageUrls.length - 1 ? (
        <Pressable
          onPress={() => goTo(index + 1)}
          accessibilityRole="button"
          accessibilityLabel="Foto berikutnya"
          className="absolute right-2 top-0 h-full w-11 items-end justify-center active:opacity-60"
        >
          <Image
            source={leftArrow}
            resizeMode="contain"
            className="h-6 w-6"
            style={RIGHT_ARROW}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
