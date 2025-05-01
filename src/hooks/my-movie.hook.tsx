import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { MovieDetailsResponse } from "@/apis/index.d";
import { useAuthContext } from "@/context";
import firebase from "@/firebase";

export interface MyMovieContextType {
  movies: WatchedMovieDoc[];
  loading: boolean;
  saveOrUpdateMovie: (
    movie: MovieDetailsResponse,
    start?: () => void,
    end?: () => void
  ) => Promise<void>;
  loadMyMovies: (start?: () => void, end?: () => void) => Promise<void>;
}

// Interface để map Firestore document
interface WatchedMovieDoc {
  userId: string;
  watchedAt: Date;
  movie: MovieDetailsResponse;
}

const useMyMovie = (): MyMovieContextType => {
  const { user } = useAuthContext();
  const [movies, setMovies] = useState<WatchedMovieDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const db = firebase.db;

  const loadMyMovies = async (start?: () => void, end?: () => void) => {
    if (!user) return;
    try {
      start?.();
      setLoading(true);

      const watchedMoviesRef = collection(db, "watched_movies");
      const q = query(
        watchedMoviesRef,
        where("userId", "==", user.sub),
        orderBy("watchedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedMovies: WatchedMovieDoc[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as WatchedMovieDoc;
        fetchedMovies.push(data);
      });
      setMovies(fetchedMovies);

    } catch (error) {
      console.error("Error loading watched movies:", error);
    } finally {
      setLoading(false);
      end?.();
    }
  };

  const saveOrUpdateMovie = async (
    movie: MovieDetailsResponse,
    start?: () => void,
    end?: () => void
  ) => {
    if (!user) return;

    try {
      start?.();

      const watchedMoviesRef = collection(db, "watched_movies");

      const q = query(
        watchedMoviesRef,
        where("userId", "==", user.sub),
        where("movie.movie._id", "==", movie.movie._id) // Lưu ý: movie.movie.name mới đúng
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Nếu đã tồn tại phim này
        const movieDoc = querySnapshot.docs[0];
        const movieRef = doc(db, "watched_movies", movieDoc.id);

        await updateDoc(movieRef, {
          watchedAt: new Date(),
        });

        console.log("Updated watchedAt for existing movie.");
      } else {
        // Nếu chưa từng xem phim này
        await addDoc(watchedMoviesRef, {
          userId: user.sub,
          watchedAt: new Date(),
          movie,
        });
        console.log("Added new movie to watched list.");
      }
     await loadMyMovies();
    } catch (error) {
      console.error("Error saving/updating movie:", error);
    } finally {
      end?.();
    }
  };

  useEffect(() => {
    loadMyMovies();
  }, [user]);

  return {
    movies,
    loading,
    saveOrUpdateMovie,
    loadMyMovies,
  };
};

export default useMyMovie;
