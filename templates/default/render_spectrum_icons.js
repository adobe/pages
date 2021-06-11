const image_type_checker = () => {
  const rows = document.querySelectorAll('.list > div');
  rows.forEach(($row) => {
    const image_column = $row.querySelector('div:first-of-type');
    if(image_column.firstChild.nodeName != "PICTURE") {
      const icon_type = image_column.innerText;
      image_column.innerHTML = `
        <img src="../../static/${icon_type}.svg">
      `
    }
  })
}

image_type_checker();