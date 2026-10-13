import { useEffect, useState } from "react";
import api from "../api";

/** GET isteği atar; { data, loading, error } döndürür. path değişince yeniden çeker. */
const useApi = (path) => {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    api
      .get(path)
      .then((res) => !cancelled && setState({ data: res.data, loading: false, error: null }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: err }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
};

export default useApi;
