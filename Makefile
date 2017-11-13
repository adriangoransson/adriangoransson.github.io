.PHONY: all cv

all: clean cv
cv: *.pdf

clean:
	rm -rf *.aux *.log *.out *.pdf

# In the very unlikely event that I would have more than one .tex file.
%.pdf: %.tex
	pdflatex $<
