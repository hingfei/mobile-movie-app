import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity onPress={() => {}} className={"w-[30%]"}>
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : "https://placehold.co/600x400/1a1a1a/ffffff.png",
                    }}
                    className={"h-52 w-full rounded-lg"}
                    resizeMode={"cover"}
                />
                <Text className={"mt-2 text-sm font-bold text-white"} numberOfLines={1}>
                    {title}
                </Text>

                <View className={"flex-row items-center justify-start gap-x-1"}>
                    <Image source={icons.star} className={"size-4"} />
                    <Text className={"text-xs font-bold uppercase text-white"}>
                        {Math.round(vote_average / 2)}
                    </Text>
                </View>

                <View className={"mt-1 flex-row items-center justify-between gap-x-1"}>
                    <Text className={"text-xs font-medium text-light-300"}>
                        {release_date?.split("-")[0]}
                    </Text>
                    {/*<Text className={"text-xs text-light-300 font-medium uppercase"}>*/}
                    {/*    Movie*/}
                    {/*</Text>*/}
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;
