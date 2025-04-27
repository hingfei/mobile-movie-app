import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
    const router = useRouter();

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
    } = useFetch(() => fetchMovies({ query: "" }));

    const isLoading = moviesLoading || trendingLoading;
    const hasError = moviesError || trendingError;

    const renderHeader = () => {
        return (
            <View>
                <Image source={icons.logo} className={"mx-auto mb-5 mt-20 h-10 w-12"}/>

                {isLoading ? (
                    <ActivityIndicator
                        size={"large"}
                        color={"#0000ff"}
                        className={"mt-10 self-center"}
                    />
                ) : hasError ? (
                    <Text>Error: {moviesError?.message || trendingError?.message}</Text>
                ) : (
                    <View className={"mt-5"}>
                        <SearchBar
                            onPress={() => router.push("/search")}
                            placeholder={"Search for a movie"}
                        />

                        {trendingMovies && (
                            <View className={"mt-10"}>
                                <Text className={"mb-3 text-lg font-bold text-white"}>
                                    Trending Movies
                                </Text>

                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    ItemSeparatorComponent={() => (
                                        <View className={"w-4"}/>
                                    )}
                                    data={trendingMovies}
                                    renderItem={({ item, index }) => (
                                        <TrendingCard movie={item} index={index} />
                                    )}
                                    keyExtractor={(item)=> item.movie_id.toString()}
                                    className={"mt-3 mb-4"}
                                    nestedScrollEnabled={true}
                                />
                            </View>
                        )}

                        <Text className={"mb-3 mt-5 text-lg font-bold text-white"}>
                            Latest Movies
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className={"flex-1 bg-primary"}>
            <Image source={images.bg} className={"absolute z-0 w-full"}/>

            {!isLoading && !hasError && movies ? (
                <FlatList
                    data={movies}
                    renderItem={({ item }) => (
                        <MovieCard {...item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        paddingRight: 5,
                        marginBottom: 10,
                    }}
                    contentContainerStyle={{
                        gap: 12,
                        paddingBottom: 128,
                        paddingHorizontal: 20
                    }}
                    className={"mt-2"}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                />
            ) : (
                <View className="flex-1 px-5">
                    {renderHeader()}
                </View>
            )}
        </View>
    );
}
