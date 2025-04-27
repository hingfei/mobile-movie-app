import { images } from "@/constants/images";
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/SearchBar";
import { updateSearchCount } from "@/services/appwrite";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchQuery]);

    useEffect(() => {
        if (movies?.length > 0 && movies?.[0]) {
            updateSearchCount(searchQuery, movies?.[0]);
        }
    }, [movies]);

    return (
        <View className={"flex-1 bg-primary"}>
            <Image
                source={images.bg}
                className={"absolute z-0 w-full flex-1"}
                resizeMode={"cover"}
            />

            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className={"px-5"}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListHeaderComponent={
                    <>
                        <View className={"mt-20 w-full flex-row items-center justify-center"}>
                            <Image source={icons.logo} className={"h-10 w-12"} />
                        </View>

                        <View className={"my-5"}>
                            <SearchBar
                                placeholder={"Search movies..."}
                                value={searchQuery}
                                onChangeText={(text: string) => setSearchQuery(text)}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator
                                size={"large"}
                                color={"#0000ff"}
                                className={"my-3"}
                            />
                        )}

                        {error && (
                            <Text className={"my-3 px-5 text-red-500"}>
                                Error: {error?.message}
                            </Text>
                        )}

                        {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
                            <Text className={"text-xl font-bold text-white"}>
                                Search Results for{" "}
                                <Text className={"text-accent"}>{searchQuery}</Text>
                            </Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className={"mt-10 px-5"}>
                            <Text className={"text-center text-gray-500"}>
                                {searchQuery.trim() ? "No movies found" : "Search for a movie"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default Search;
