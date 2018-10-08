package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

var word string

const (
	cmdFile = "/var/run/ckb1/cmd"
)

func makeCmdStr(word string, color string) string {
	word = strings.ToLower(word)
	letters := strings.Split(word, "")
	cmdStr := fmt.Sprintf("mode 6 rgb %s:%s", strings.Join(letters, ","), color)
	return cmdStr
}

func execCmd(cmdStr string) {
	ioutil.WriteFile(cmdFile, []byte(cmdStr), 666)
}

func lighterRoutine() {
	for {
		if word != "" {
			cmdStr := makeCmdStr(word, "9c9c9c")
			execCmd(cmdStr)
		}
		time.Sleep((1 * time.Second) / 30)
	}

}

func main() {

	go lighterRoutine()
	http.HandleFunc("/on", func(w http.ResponseWriter, r *http.Request) {
		newWord := r.URL.Query().Get("word")
		if newWord != word {
			// turn off old word.
			execCmd(makeCmdStr(word, "000000"))

			word = newWord
		}

		w.WriteHeader(200)

	})
	http.ListenAndServe(":5555", nil)
}
